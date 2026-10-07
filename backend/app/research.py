import time
import httpx
import xml.etree.ElementTree as ET
from urllib.parse import quote

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


ARXIV_API_URL = "https://export.arxiv.org/api/query"

# Load the embedding model only once.
_embedding_model = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("Embedding model loaded.")

    return _embedding_model


def search_arxiv(
    query: str,
    max_results: int = 20
) -> list[dict]:
    """
    Retrieve research papers dynamically from arXiv.
    """

    if not query or not query.strip():
        return []

    encoded_query = quote(query.strip())

    url = (
        f"{ARXIV_API_URL}"
        f"?search_query=all:{encoded_query}"
        f"&start=0"
        f"&max_results={max_results}"
        f"&sortBy=relevance"
        f"&sortOrder=descending"
    )

    headers = {
        "User-Agent": "VELA-Research-Agent/0.1"
    }

    for attempt in range(3):

        response = httpx.get(
            url,
            headers=headers,
            timeout=30.0
        )

        if response.status_code == 429:

            if attempt < 2:
                wait_time = 10 * (attempt + 1)

                print(
                    f"arXiv rate limit reached. "
                    f"Waiting {wait_time} seconds..."
                )

                time.sleep(wait_time)
                continue

            raise RuntimeError(
                "arXiv is temporarily rate-limiting requests. "
                "Please wait a few minutes and try again."
            )

        response.raise_for_status()
        break

    root = ET.fromstring(response.text)

    namespace = {
        "atom": "http://www.w3.org/2005/Atom"
    }

    papers = []

    for entry in root.findall(
        "atom:entry",
        namespace
    ):

        paper_id = entry.findtext(
            "atom:id",
            "",
            namespace
        ).strip()

        title = entry.findtext(
            "atom:title",
            "",
            namespace
        ).strip()

        abstract = entry.findtext(
            "atom:summary",
            "",
            namespace
        ).strip()

        published = entry.findtext(
            "atom:published",
            "",
            namespace
        )

        authors = []

        for author in entry.findall(
            "atom:author",
            namespace
        ):

            name = author.findtext(
                "atom:name",
                "",
                namespace
            )

            if name:
                authors.append(name.strip())

        papers.append(
            {
                "external_id": paper_id,
                "title": " ".join(title.split()),
                "authors": authors,
                "abstract": " ".join(abstract.split()),
                "url": paper_id,
                "published_date": published,
                "source": "arxiv",
            }
        )

    return papers


def deduplicate_papers(
    papers: list[dict]
) -> list[dict]:
    """
    Remove duplicate papers using arXiv ID or title.
    """

    seen = set()
    unique_papers = []

    for paper in papers:

        external_id = paper.get(
            "external_id",
            ""
        ).strip()

        title = paper.get(
            "title",
            ""
        ).strip().lower()

        key = external_id or title

        if not key:
            continue

        if key in seen:
            continue

        seen.add(key)
        unique_papers.append(paper)

    return unique_papers


def rank_papers(
    query: str,
    papers: list[dict],
    top_k: int = 10
) -> list[dict]:
    """
    Rank papers using semantic similarity between
    the research query and paper title + abstract.
    """

    if not papers:
        return []

    model = get_embedding_model()

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    paper_texts = [
        f"{paper['title']}. {paper['abstract']}"
        for paper in papers
    ]

    paper_embeddings = model.encode(
        paper_texts,
        normalize_embeddings=True
    )

    scores = cosine_similarity(
        query_embedding,
        paper_embeddings
    )[0]

    ranked_papers = []

    for paper, score in zip(
        papers,
        scores
    ):

        result = paper.copy()

        result["relevance_score"] = round(
            float(score),
            4
        )

        result["abstract_only"] = not bool(
            paper.get("abstract", "").strip()
        )

        ranked_papers.append(result)

    ranked_papers.sort(
        key=lambda paper: paper["relevance_score"],
        reverse=True
    )

    return ranked_papers[:top_k]


def search_relevant_papers(
    query: str,
    candidate_count: int = 20,
    top_k: int = 10
) -> list[dict]:
    """
    Original search function.
    Kept for compatibility.
    """

    if not query or not query.strip():
        return []

    papers = search_arxiv(
        query=query,
        max_results=candidate_count
    )

    ranked_papers = rank_papers(
        query=query,
        papers=papers,
        top_k=top_k
    )

    return ranked_papers


def search_research_with_stats(
    query: str,
    candidate_count: int = 20,
    top_k: int = 10
) -> dict:
    """
    Complete discovery pipeline with statistics.

    1. Retrieve papers
    2. Deduplicate
    3. Semantic ranking
    4. Return statistics
    """

    if not query or not query.strip():
        return {
            "papers": [],
            "stats": {
                "retrieved": 0,
                "deduplicated": 0,
                "ranked": 0,
                "abstract_only": 0
            }
        }

    retrieved_papers = search_arxiv(
        query=query,
        max_results=candidate_count
    )

    unique_papers = deduplicate_papers(
        retrieved_papers
    )

    ranked_papers = rank_papers(
        query=query,
        papers=unique_papers,
        top_k=top_k
    )

    abstract_only = sum(
        1
        for paper in ranked_papers
        if paper.get("abstract_only", False)
    )

    return {
        "papers": ranked_papers,
        "stats": {
            "retrieved": len(retrieved_papers),
            "deduplicated": len(unique_papers),
            "ranked": len(ranked_papers),
            "abstract_only": abstract_only
        }
    }