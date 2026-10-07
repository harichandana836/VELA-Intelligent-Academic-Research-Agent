import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPapers = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setPapers([]);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/research/search?query=${encodeURIComponent(query)}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Research search failed");
      }

      const data = await response.json();
      setPapers(data.results || []);
    } catch (err) {
      setError("Unable to connect to VELA backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>VELA</h1>
        <p>Intelligent Academic Research Agent</p>
      </header>

      <main>
        <section className="hero">
          <h2>Discover Research Papers</h2>
          <p>
            Search academic literature from arXiv using your research topic.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a research topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPapers()}
            />
            <button onClick={searchPapers}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </section>

        {error && <div className="error">{error}</div>}

        {papers.length > 0 && (
          <section className="results">
            <h2>Research Results</h2>

            {papers.map((paper, index) => (
              <div className="paper-card" key={paper.external_id || index}>
                <div className="score">
                  {(paper.relevance_score || 0).toFixed(3)}
                </div>

                <div>
                  <h3>{paper.title}</h3>

                  <p className="authors">
                    {paper.authors?.join(", ") || "Authors unavailable"}
                  </p>

                  <p className="abstract">
                    {paper.abstract || "No abstract available."}
                  </p>

                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Paper →
                  </a>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;