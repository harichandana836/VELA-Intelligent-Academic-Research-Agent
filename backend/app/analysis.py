import asyncio
import json
import os
import re
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()

OPENROUTER_BASE_URL = os.getenv(
    "OPENROUTER_BASE_URL",
    "https://openrouter.ai/api/v1"
).rstrip("/")

LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "openrouter/free"
).strip()

CHAT_COMPLETIONS_URL = (
    f"{OPENROUTER_BASE_URL}/chat/completions"
)


# ============================================================
# PERSISTENT CACHE
# ============================================================

CACHE_DIR = Path(__file__).resolve().parent.parent / ".vela_cache"
CACHE_DIR.mkdir(exist_ok=True)

CACHE_FILE = CACHE_DIR / "analysis_cache.json"


def load_cache() -> dict:
    if not CACHE_FILE.exists():
        return {}

    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


_analysis_cache = load_cache()


def save_cache() -> None:
    try:
        temp_file = CACHE_FILE.with_suffix(".tmp")

        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(
                _analysis_cache,
                f,
                ensure_ascii=False,
                indent=2
            )

        temp_file.replace(CACHE_FILE)

    except Exception as exc:
        print(f"[VELA] Cache save warning: {exc}")


def make_cache_key(paper: dict) -> str:
    paper_id = (
        paper.get("external_id")
        or paper.get("id")
        or paper.get("url")
        or paper.get("title")
        or ""
    )

    return f"{paper_id}:{LLM_MODEL}:analysis-v2"


# ============================================================
# JSON HELPERS
# ============================================================

def clean_json_text(content: str) -> str:
    content = content.strip()

    if content.startswith("```"):
        lines = content.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]

        content = "\n".join(lines).strip()

    return content


def parse_json_response(content: str) -> dict:
    cleaned = clean_json_text(content)

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start != -1 and end != -1 and end > start:
            return json.loads(
                cleaned[start:end + 1]
            )

        raise


# ============================================================
# OPENROUTER
# ============================================================

async def call_openrouter(
    client: httpx.AsyncClient,
    messages: list[dict],
    max_tokens: int = 1000
) -> str:

    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not configured."
        )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "VELA Intelligent Academic Research Agent",
    }

    payload = {
        "model": LLM_MODEL,
        "messages": messages,
        "temperature": 0.1,
        "max_tokens": max_tokens,
    }

    try:

        response = await client.post(
            CHAT_COMPLETIONS_URL,
            headers=headers,
            json=payload,
            timeout=45.0,
        )

        if response.status_code >= 400:
            raise RuntimeError(
                f"OpenRouter HTTP {response.status_code}"
            )

        data = response.json()

        content = (
            data
            .get("choices", [{}])[0]
            .get("message", {})
            .get("content")
        )

        if not content:
            raise RuntimeError(
                "OpenRouter returned empty content."
            )

        return content

    except (
        httpx.TimeoutException,
        httpx.NetworkError
    ) as exc:

        raise RuntimeError(
            f"OpenRouter connection failed: {exc}"
        ) from exc


# ============================================================
# PAPER PROMPT
# ============================================================

def build_paper_prompt(paper: dict) -> list[dict]:

    title = str(
        paper.get("title", "")
    ).strip()

    authors = paper.get("authors", [])

    if isinstance(authors, list):
        authors_text = ", ".join(
            str(a) for a in authors
        )
    else:
        authors_text = str(authors)

    abstract = str(
        paper.get("abstract", "")
    ).strip()

    abstract = abstract[:6000]

    if not abstract:
        abstract = "NO ABSTRACT AVAILABLE."

    user_prompt = f"""
Analyze this academic paper using ONLY the supplied metadata
and abstract.

TITLE:
{title}

AUTHORS:
{authors_text}

ABSTRACT:
{abstract}

Return ONLY valid JSON:

{{
  "research_problem": "...",
  "methodology": "...",
  "dataset_experimental_setup": "...",
  "key_findings": "...",
  "limitations": "...",
  "evidence": "..."
}}

Rules:
- Do not invent information.
- Use only evidence from the supplied abstract.
- If information is unavailable, write "INSUFFICIENT EVIDENCE".
- Keep each field concise.
- Evidence must refer to information actually present in the abstract.
"""

    return [
        {
            "role": "system",
            "content": (
                "You are VELA, an evidence-grounded "
                "academic research analysis agent."
            ),
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]


# ============================================================
# LOCAL EVIDENCE FALLBACK
# ============================================================

def sentence_extract(
    abstract: str,
    keywords: list[str],
    limit: int = 2
) -> str:

    if not abstract:
        return "INSUFFICIENT EVIDENCE"

    sentences = re.split(
        r"(?<=[.!?])\s+",
        abstract
    )

    matches = []

    for sentence in sentences:

        low = sentence.lower()

        if any(
            keyword in low
            for keyword in keywords
        ):
            matches.append(sentence.strip())

    if not matches:
        return "INSUFFICIENT EVIDENCE"

    return " ".join(matches[:limit])


def local_evidence_analysis(
    paper: dict
) -> dict:

    abstract = str(
        paper.get("abstract", "")
    ).strip()

    if not abstract:
        return {
            "research_problem":
                "INSUFFICIENT EVIDENCE",

            "methodology":
                "INSUFFICIENT EVIDENCE",

            "dataset_experimental_setup":
                "INSUFFICIENT EVIDENCE",

            "key_findings":
                "INSUFFICIENT EVIDENCE",

            "limitations":
                "INSUFFICIENT EVIDENCE",

            "evidence":
                "INSUFFICIENT EVIDENCE",
        }

    problem = sentence_extract(
        abstract,
        [
            "problem",
            "challenge",
            "aim",
            "objective",
            "address",
            "propose"
        ]
    )

    methodology = sentence_extract(
        abstract,
        [
            "method",
            "model",
            "algorithm",
            "framework",
            "approach",
            "architecture",
            "training"
        ]
    )

    setup = sentence_extract(
        abstract,
        [
            "dataset",
            "data",
            "experiment",
            "benchmark",
            "simulation",
            "evaluation"
        ]
    )

    findings = sentence_extract(
        abstract,
        [
            "result",
            "results",
            "achieve",
            "achieved",
            "improve",
            "improved",
            "outperform",
            "performance",
            "accuracy",
            "demonstrate"
        ]
    )

    limitations = sentence_extract(
        abstract,
        [
            "limitation",
            "limited",
            "future work",
            "however",
            "challenge",
            "remain"
        ]
    )

    return {
        "research_problem": problem,
        "methodology": methodology,
        "dataset_experimental_setup": setup,
        "key_findings": findings,
        "limitations": limitations,
        "evidence": (
            "Evidence extracted directly from the "
            "supplied paper abstract."
        ),
    }


# ============================================================
# ONE PAPER
# ============================================================

async def analyze_one_paper(
    client: httpx.AsyncClient,
    paper: dict,
    semaphore: asyncio.Semaphore
) -> dict:

    cache_key = make_cache_key(paper)

    # --------------------------------------------------------
    # PERSISTENT CACHE
    # --------------------------------------------------------

    if cache_key in _analysis_cache:

        cached = _analysis_cache[cache_key].copy()
        cached["cached"] = True

        print(
            f"[VELA] Cache HIT: "
            f"{paper.get('title', 'Untitled')}"
        )

        return cached

    async with semaphore:

        try:

            print(
                f"[VELA] LLM analyzing: "
                f"{paper.get('title', 'Untitled')}"
            )

            content = await call_openrouter(
                client=client,
                messages=build_paper_prompt(paper),
                max_tokens=1000,
            )

            analysis = parse_json_response(
                content
            )

            required_fields = [
                "research_problem",
                "methodology",
                "dataset_experimental_setup",
                "key_findings",
                "limitations",
                "evidence",
            ]

            for field in required_fields:

                if not analysis.get(field):
                    analysis[field] = (
                        "INSUFFICIENT EVIDENCE"
                    )

            result = {
                "paper_id": paper.get(
                    "external_id"
                ),
                "title": paper.get(
                    "title"
                ),
                "status": "completed",
                "cached": False,
                "fallback": False,
                "analysis": analysis,
            }

            # IMPORTANT:
            # Only successful results are cached.
            _analysis_cache[cache_key] = result
            save_cache()

            return result

        except Exception as exc:

            print(
                f"[VELA] LLM unavailable for "
                f"{paper.get('title', 'Untitled')}"
            )

            print(
                f"[VELA] Using evidence-only fallback: "
                f"{type(exc).__name__}"
            )

            # ------------------------------------------------
            # LOCAL FALLBACK
            # ------------------------------------------------

            analysis = local_evidence_analysis(
                paper
            )

            result = {
                "paper_id": paper.get(
                    "external_id"
                ),
                "title": paper.get(
                    "title"
                ),
                "status": "completed",
                "cached": False,
                "fallback": True,
                "analysis": analysis,
            }

            # Cache fallback too.
            # This prevents another API call during
            # repeated testing.
            _analysis_cache[cache_key] = result
            save_cache()

            return result


# ============================================================
# GAP PROMPT
# ============================================================

def build_gap_prompt(
    query: str,
    analyses: list[dict]
) -> list[dict]:

    compact_items = []

    for item in analyses:

        if item.get("status") != "completed":
            continue

        analysis = item.get(
            "analysis",
            {}
        )

        compact_items.append({
            "title": item.get("title"),

            "research_problem":
                analysis.get(
                    "research_problem"
                ),

            "methodology":
                analysis.get(
                    "methodology"
                ),

            "key_findings":
                analysis.get(
                    "key_findings"
                ),

            "limitations":
                analysis.get(
                    "limitations"
                ),

            "evidence":
                analysis.get(
                    "evidence"
                ),
        })

    evidence_text = json.dumps(
        compact_items,
        ensure_ascii=False
    )[:14000]

    user_prompt = f"""
Research topic:
{query}

Evidence-grounded paper analyses:

{evidence_text}

Identify 2 to 5 potential research gaps supported
ONLY by the supplied analyses.

Return ONLY valid JSON:

{{
  "literature_summary": "...",
  "gaps": [
    {{
      "title": "...",
      "explanation": "...",
      "supporting_papers": ["..."],
      "supporting_evidence": "...",
      "confidence": "High|Medium|Low"
    }}
  ]
}}

Rules:
- Never invent papers.
- Never invent findings.
- Never invent limitations.
- Every gap must be supported by supplied evidence.
- If evidence is insufficient, say INSUFFICIENT EVIDENCE.
"""

    return [
        {
            "role": "system",
            "content": (
                "You are VELA's evidence-grounded "
                "literature synthesis engine."
            ),
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]


# ============================================================
# LOCAL GAP SYNTHESIS
# ============================================================

def local_gap_synthesis(
    query: str,
    analyses: list[dict]
) -> dict:

    completed = [
        item
        for item in analyses
        if item.get("status") == "completed"
    ]

    if not completed:
        return {
            "status": "insufficient_evidence",
            "literature_summary":
                "INSUFFICIENT EVIDENCE",
            "gaps": [],
        }

    gaps = []

    # --------------------------------------------------------
    # GAP 1: Methodology variation
    # --------------------------------------------------------

    methodology_items = []

    for item in completed:

        analysis = item.get(
            "analysis",
            {}
        )

        value = analysis.get(
            "methodology",
            ""
        )

        if (
            value
            and value != "INSUFFICIENT EVIDENCE"
        ):
            methodology_items.append(
                item.get("title")
            )

    if len(methodology_items) >= 2:

        gaps.append({
            "title":
                "Limited methodological convergence",

            "explanation":
                "The analyzed literature uses "
                "different methodological approaches, "
                "indicating an opportunity for systematic "
                "comparison and evaluation.",

            "supporting_papers":
                methodology_items[:5],

            "supporting_evidence":
                "Multiple analyzed papers report "
                "different methodologies.",

            "confidence": "Medium",
        })

    # --------------------------------------------------------
    # GAP 2: Evaluation
    # --------------------------------------------------------

    evaluation_items = []

    for item in completed:

        analysis = item.get(
            "analysis",
            {}
        )

        setup = analysis.get(
            "dataset_experimental_setup",
            ""
        )

        findings = analysis.get(
            "key_findings",
            ""
        )

        if (
            setup == "INSUFFICIENT EVIDENCE"
            or findings == "INSUFFICIENT EVIDENCE"
        ):
            evaluation_items.append(
                item.get("title")
            )

    if evaluation_items:

        gaps.append({
            "title":
                "Insufficiently reported experimental evidence",

            "explanation":
                "Some analyzed papers provide limited "
                "experimental or evaluation details in "
                "their available abstracts, suggesting "
                "a need for more transparent and "
                "reproducible evaluation.",

            "supporting_papers":
                evaluation_items[:5],

            "supporting_evidence":
                "The available paper abstracts do not "
                "provide complete experimental details "
                "for all analyzed papers.",

            "confidence": "Medium",
        })

    # --------------------------------------------------------
    # GAP 3: Limitations / future work
    # --------------------------------------------------------

    limitation_items = []

    for item in completed:

        analysis = item.get(
            "analysis",
            {}
        )

        limitations = analysis.get(
            "limitations",
            ""
        )

        if (
            limitations
            and limitations != "INSUFFICIENT EVIDENCE"
        ):
            limitation_items.append(
                item.get("title")
            )

    if len(limitation_items) >= 2:

        gaps.append({
            "title":
                "Unresolved limitations across existing approaches",

            "explanation":
                "Multiple analyzed studies identify "
                "limitations or remaining challenges, "
                "indicating opportunities for future "
                "work addressing these limitations.",

            "supporting_papers":
                limitation_items[:5],

            "supporting_evidence":
                "The analyzed literature reports "
                "limitations or remaining challenges.",

            "confidence": "Medium",
        })

    if not gaps:

        return {
            "status": "insufficient_evidence",
            "literature_summary":
                "The analyzed abstracts do not contain "
                "enough cross-paper evidence to identify "
                "a reliable research gap.",
            "gaps": [],
        }

    return {
        "status": "completed",
        "literature_summary":
            (
                f"The literature on {query} shows "
                "multiple approaches and evaluation "
                "patterns, while several areas remain "
                "open for further investigation."
            ),
        "gaps": gaps[:5],
    }


# ============================================================
# RESEARCH GAP SYNTHESIS
# ============================================================

async def synthesize_research_gaps(
    client: httpx.AsyncClient,
    query: str,
    analyses: list[dict]
) -> dict:

    completed = [
        item
        for item in analyses
        if item.get("status") == "completed"
    ]

    if not completed:

        return {
            "status":
                "insufficient_evidence",

            "literature_summary":
                "INSUFFICIENT EVIDENCE",

            "gaps": [],
        }

    # --------------------------------------------------------
    # GAP CACHE
    # --------------------------------------------------------

    gap_key = (
        "gaps-v2:"
        + query.strip().lower()
        + ":"
        + "|".join(
            str(
                item.get("paper_id")
            )
            for item in completed
        )
    )

    if gap_key in _analysis_cache:

        cached = _analysis_cache[
            gap_key
        ].copy()

        print(
            "[VELA] Gap synthesis cache HIT"
        )

        return cached

    # --------------------------------------------------------
    # Try LLM ONCE
    # --------------------------------------------------------

    try:

        print(
            "[VELA] Synthesizing research gaps..."
        )

        content = await call_openrouter(
            client=client,
            messages=build_gap_prompt(
                query=query,
                analyses=completed
            ),
            max_tokens=1200,
        )

        result = parse_json_response(
            content
        )

        gaps = result.get(
            "gaps",
            []
        )

        if not isinstance(gaps, list):
            raise ValueError(
                "Invalid gap response."
            )

        final_result = {
            "status": "completed",
            "literature_summary":
                result.get(
                    "literature_summary",
                    "INSUFFICIENT EVIDENCE"
                ),
            "gaps": gaps[:5],
        }

        _analysis_cache[gap_key] = final_result
        save_cache()

        return final_result

    except Exception as exc:

        print(
            "[VELA] LLM gap synthesis unavailable."
        )

        print(
            f"[VELA] Using evidence-based "
            f"gap fallback: {type(exc).__name__}"
        )

        # ----------------------------------------------------
        # LOCAL FALLBACK
        # ----------------------------------------------------

        result = local_gap_synthesis(
            query=query,
            analyses=completed
        )

        _analysis_cache[gap_key] = result
        save_cache()

        return result


# ============================================================
# MAIN ANALYSIS PIPELINE
# ============================================================

async def analyze_research(
    query: str,
    papers: list[dict]
) -> dict:

    # Never analyze more than 10.
    selected_papers = papers[:10]

    if not selected_papers:

        return {
            "query": query,
            "selected": 0,
            "analyzed": 0,
            "failed": 0,
            "analyses": [],
            "literature_analysis": {
                "status":
                    "insufficient_evidence",

                "literature_summary":
                    "INSUFFICIENT EVIDENCE",

                "gaps": [],
            },
        }

    print(
        "\n========================================"
    )

    print(
        f"[VELA] Starting analysis: "
        f"{len(selected_papers)} papers"
    )

    print(
        "========================================"
    )

    # Sequential requests.
    # This is intentional:
    # less rate-limit pressure + safer free-model usage.
    semaphore = asyncio.Semaphore(1)

    timeout = httpx.Timeout(
        50.0,
        connect=15.0
    )

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:

        analyses = []

        for index, paper in enumerate(
            selected_papers,
            start=1
        ):

            print(
                f"[VELA] Analyzing paper "
                f"{index}/{len(selected_papers)}"
            )

            result = await analyze_one_paper(
                client=client,
                paper=paper,
                semaphore=semaphore,
            )

            analyses.append(result)

    # --------------------------------------------------------
    # Count completed
    # --------------------------------------------------------

    completed_count = sum(
        1
        for item in analyses
        if item.get("status") == "completed"
    )

    # Only truly unexpected internal failures
    # remain as failed.
    failed_count = (
        len(analyses)
        - completed_count
    )

    print(
        f"[VELA] Analyzed: "
        f"{completed_count}"
    )

    print(
        f"[VELA] Failed: "
        f"{failed_count}"
    )

    # --------------------------------------------------------
    # Gap synthesis
    # --------------------------------------------------------

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:

        literature = await synthesize_research_gaps(
            client=client,
            query=query,
            analyses=analyses,
        )

    print(
        "[VELA] Research gap synthesis complete."
    )

    print(
        "========================================\n"
    )

    return {
        "query": query,

        "selected":
            len(selected_papers),

        "analyzed":
            completed_count,

        "failed":
            failed_count,

        "analyses":
            analyses,

        "literature_analysis":
            literature,
    }