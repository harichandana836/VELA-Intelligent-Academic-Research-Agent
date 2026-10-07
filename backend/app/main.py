from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.research import search_research_with_stats
from app.analysis import analyze_research


app = FastAPI(
    title="VELA API",
    version="0.1.0",
    description="Intelligent Academic Research Agent"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchAnalysisRequest(BaseModel):
    query: str
    papers: list[dict]


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "VELA",
        "version": "0.1.0"
    }


@app.get("/research/search")
def research_search(
    query: str = Query(..., min_length=2),
    limit: int = Query(50, ge=1, le=100)
):

    result = search_research_with_stats(
        query=query,
        candidate_count=limit,
        top_k=limit
    )

    return {
        "query": query,
        "count": len(result["papers"]),
        "stats": result["stats"],
        "results": result["papers"]
    }


@app.post("/research/analyze")
async def research_analyze(
    request: ResearchAnalysisRequest
):

    if not request.query.strip():
        return {
            "status": "error",
            "message": "Research query is required."
        }

    if not request.papers:
        return {
            "status": "error",
            "message": "At least one paper is required."
        }

    return await analyze_research(
        query=request.query,
        papers=request.papers
    )