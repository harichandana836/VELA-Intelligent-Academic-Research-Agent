import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="header">
    <div class="header-inner">

      <div class="brand-block">
        <div class="brand">VELA</div>

        <div class="subtitle">
          Intelligent Academic Research Agent
        </div>
      </div>

      <div class="api-status">
        <span class="status-dot"></span>
        API ONLINE
      </div>

    </div>
  </header>


  <main class="container">

    <!-- HERO -->

    <section class="hero">

      <div class="eyebrow">
        ACADEMIC RESEARCH WORKSPACE
      </div>

      <h1>
        VELA Research Workspace
      </h1>

      <p>
        Discover, analyze, and synthesize academic literature
        for your research.
      </p>

      <div class="search-box">

        <input
          id="query"
          type="text"
          placeholder="Enter a research topic..."
        />

        <button id="searchBtn">
          Discover Research
        </button>

        <button
          id="resetBtn"
          class="secondary-btn"
        >
          Reset
        </button>

      </div>

    </section>


    <section id="status"></section>


    <!-- WORKSPACE NAVIGATION -->

    <nav
      id="workspaceNav"
      class="workspace-nav hidden"
    >

      <button
        class="nav-tab active"
        data-target="corpusSection"
      >
        <span>01</span>
        Research Corpus
      </button>

      <button
        class="nav-tab"
        data-target="analysisResults"
      >
        <span>02</span>
        Literature Analysis
      </button>

      <button
        class="nav-tab"
        data-target="gapsSection"
      >
        <span>03</span>
        Research Gaps
      </button>

    </nav>


    <!-- DISCOVERY / CORPUS -->

    <section
      id="discoverySection"
      class="hidden"
    >

      <section
        id="corpusSection"
        class="workspace-section"
      >

        <div class="section-heading">

          <div>

            <div class="eyebrow">
              RESEARCH CORPUS
            </div>

            <h2>
              Ranked Research Literature
            </h2>

          </div>

          <div
            id="paperCount"
            class="count-label"
          >
            0 papers
          </div>

        </div>


        <!-- STATS -->

        <div
          id="stats"
          class="stats-grid"
        ></div>


        <!-- PROCESSING -->

        <div
          id="discoveryProgress"
          class="processing-panel hidden"
        >

          <div class="processing-header">

            <span>
              RESEARCH PROCESSING
            </span>

            <strong id="processingStatus">
              Processing...
            </strong>

          </div>

          <div class="processing-track">

            <div
              id="processingBar"
              class="processing-bar"
            ></div>

          </div>

          <div class="processing-steps">

            <span>
              Retrieving Literature
            </span>

            <span>
              Ranking Literature
            </span>

            <span>
              Corpus Ready
            </span>

          </div>

        </div>


        <!-- ANALYSIS CONTROL -->

        <div class="control-panel">

          <div class="control-info">

            <div class="control-title">
              AI Analysis Selection
            </div>

            <div class="control-description">
              VELA automatically selects the highest-ranked
              papers based on semantic relevance. No manual
              paper-by-paper selection is required.
            </div>

            <div
              id="selectionCount"
              class="selection-count"
            >
              Top 5 papers will be analyzed
            </div>

          </div>


          <div class="analysis-limit-control">

            <label for="analysisLimit">
              Papers to Analyze
            </label>

            <div class="limit-row">

              <input
                id="analysisLimit"
                type="number"
                min="1"
                max="10"
                value="5"
              />

              <span>
                papers
              </span>

            </div>

            <input
              id="analysisLimitRange"
              type="range"
              min="1"
              max="10"
              value="5"
            />

            <div class="range-labels">

              <span>1</span>

              <span>10</span>

            </div>

          </div>

        </div>


        <div
          id="analysisNotice"
          class="analysis-notice"
        >
          VELA will automatically analyze the top 5 ranked papers.
        </div>


        <div class="action-row">

          <button
            id="startAnalysisBtn"
            class="primary-action"
          >
            Start Research Analysis (5 Papers)
          </button>

        </div>


        <!-- PAPERS -->

        <div
          id="results"
          class="paper-list"
        ></div>


        <!-- MORE PAPERS -->

        <div
          id="morePapersContainer"
          class="more-container hidden"
        >

          <div
            id="paperDisplayInfo"
            class="paper-display-info"
          ></div>

          <button
            id="morePapersBtn"
            class="more-btn"
          >
            More Papers
          </button>

        </div>

      </section>


      <!-- ANALYSIS PROGRESS -->

      <section
        id="progressSection"
        class="workspace-section hidden"
      >

        <div class="eyebrow">
          RESEARCH ANALYSIS
        </div>

        <h2>
          Analysis Progress
        </h2>

        <div class="progress-panel">

          <div
            class="progress-step"
            id="step-indexing"
          >

            <span class="step-number">
              01
            </span>

            <span>
              Indexing Research Corpus
            </span>

            <span class="step-state">
              Waiting
            </span>

          </div>


          <div
            class="progress-step"
            id="step-analyzing"
          >

            <span class="step-number">
              02
            </span>

            <span>
              Analyzing Top-Ranked Papers
            </span>

            <span class="step-state">
              Waiting
            </span>

          </div>


          <div
            class="progress-step"
            id="step-synthesizing"
          >

            <span class="step-number">
              03
            </span>

            <span>
              Synthesizing Research Gaps
            </span>

            <span class="step-state">
              Waiting
            </span>

          </div>


          <div
            class="progress-step"
            id="step-completed"
          >

            <span class="step-number">
              04
            </span>

            <span>
              Completed
            </span>

            <span class="step-state">
              Waiting
            </span>

          </div>

        </div>

      </section>


      <!-- LITERATURE ANALYSIS -->

      <section
        id="analysisResults"
        class="workspace-section analysis-results hidden"
      >

        <div class="section-heading">

          <div>

            <div class="eyebrow">
              LITERATURE ANALYSIS
            </div>

            <h2>
              Paper Analysis
            </h2>

          </div>

          <div
            id="analysisCount"
            class="count-label"
          >
            0 analyzed
          </div>

        </div>


        <div
          id="analysisCards"
          class="analysis-cards"
        ></div>


        <div class="section-navigation">

          <button
            id="viewGapsBtn"
            class="primary-action"
          >
            View Potential Research Gaps →
          </button>

        </div>

      </section>


      <!-- RESEARCH GAPS -->

      <section
        id="gapsSection"
        class="workspace-section hidden"
      >

        <div class="section-heading">

          <div>

            <div class="eyebrow">
              SYNTHESIS
            </div>

            <h2>
              Potential Research Gaps
            </h2>

          </div>

          <div
            id="gapCount"
            class="count-label"
          >
            0 gaps
          </div>

        </div>


        <div
          id="literatureSummary"
          class="literature-summary"
        ></div>


        <div
          id="gapCards"
          class="gap-panel"
        ></div>


        <div class="section-navigation">

          <button
            id="backToAnalysisBtn"
            class="secondary-action"
          >
            ↑ Back to Literature Analysis
          </button>

        </div>

      </section>

    </section>

  </main>
`;


/* =====================================================
   ELEMENTS
===================================================== */

const queryInput =
  document.querySelector("#query");

const searchBtn =
  document.querySelector("#searchBtn");

const resetBtn =
  document.querySelector("#resetBtn");

const statusDiv =
  document.querySelector("#status");

const statsDiv =
  document.querySelector("#stats");

const discoverySection =
  document.querySelector("#discoverySection");

const corpusSection =
  document.querySelector("#corpusSection");

const workspaceNav =
  document.querySelector("#workspaceNav");

const resultsDiv =
  document.querySelector("#results");

const paperCount =
  document.querySelector("#paperCount");

const analysisLimit =
  document.querySelector("#analysisLimit");

const analysisLimitRange =
  document.querySelector("#analysisLimitRange");

const selectionCount =
  document.querySelector("#selectionCount");

const analysisNotice =
  document.querySelector("#analysisNotice");

const startAnalysisBtn =
  document.querySelector("#startAnalysisBtn");

const progressSection =
  document.querySelector("#progressSection");

const analysisResults =
  document.querySelector("#analysisResults");

const analysisCards =
  document.querySelector("#analysisCards");

const analysisCount =
  document.querySelector("#analysisCount");

const gapsSection =
  document.querySelector("#gapsSection");

const gapCards =
  document.querySelector("#gapCards");

const gapCount =
  document.querySelector("#gapCount");

const literatureSummary =
  document.querySelector("#literatureSummary");

const discoveryProgress =
  document.querySelector("#discoveryProgress");

const processingBar =
  document.querySelector("#processingBar");

const processingStatus =
  document.querySelector("#processingStatus");

const morePapersContainer =
  document.querySelector("#morePapersContainer");

const morePapersBtn =
  document.querySelector("#morePapersBtn");

const paperDisplayInfo =
  document.querySelector("#paperDisplayInfo");

const viewGapsBtn =
  document.querySelector("#viewGapsBtn");

const backToAnalysisBtn =
  document.querySelector("#backToAnalysisBtn");


/* =====================================================
   STATE
===================================================== */

let discoveredPapers = [];

let visiblePaperCount = 10;

const PAPERS_PER_LOAD = 10;

const MAX_RETRIEVAL = 60;

const MAX_ANALYSIS = 10;


/* =====================================================
   SEARCH
===================================================== */

async function searchPapers() {

  const query =
    queryInput.value.trim();

  if (!query) {

    showError(
      "Please enter a research topic."
    );

    return;
  }


  searchBtn.disabled = true;

  resetBtn.disabled = true;

  searchBtn.textContent =
    "Discovering...";


  statusDiv.innerHTML = `
    <div class="status-message">
      Searching and ranking academic literature...
    </div>
  `;


  /*
    Every new search starts again from
    the Research Corpus.
  */

  corpusSection.classList.remove(
    "hidden"
  );

  discoverySection.classList.remove(
    "hidden"
  );

  workspaceNav.classList.remove(
    "hidden"
  );

  progressSection.classList.add(
    "hidden"
  );

  analysisResults.classList.add(
    "hidden"
  );

  gapsSection.classList.add(
    "hidden"
  );


  visiblePaperCount = 10;


  setActiveTab(
    "corpusSection"
  );


  showDiscoveryProgress();


  try {

    const response =
      await fetch(
        `http://127.0.0.1:8000/research/search?query=${encodeURIComponent(
          query
        )}&limit=${MAX_RETRIEVAL}`
      );


    if (!response.ok) {

      throw new Error(
        `Backend request failed: ${response.status}`
      );

    }


    const data =
      await response.json();


    discoveredPapers =
      data.results || [];


    renderStats(
      data.stats || {}
    );


    paperCount.textContent =
      `${discoveredPapers.length} papers`;


    renderPapers();


    completeDiscoveryProgress();


    statusDiv.innerHTML = `
      <div class="status-message success-message">
        Discovery completed — ${
          discoveredPapers.length
        } ranked papers available.
      </div>
    `;


    updateAnalysisControls();


  } catch (error) {

    console.error(
      "VELA Discovery Error:",
      error
    );


    hideDiscoveryProgress();


    showError(
      "Could not connect to VELA backend. Make sure FastAPI is running on port 8000."
    );


  } finally {

    searchBtn.disabled = false;

    resetBtn.disabled = false;

    searchBtn.textContent =
      "Discover Research";

  }

}


/* =====================================================
   DISCOVERY PROCESSING
===================================================== */

function showDiscoveryProgress() {

  discoveryProgress.classList.remove(
    "hidden"
  );

  processingBar.style.width =
    "25%";

  processingStatus.textContent =
    "Retrieving...";

}


function completeDiscoveryProgress() {

  processingBar.style.width =
    "100%";

  processingStatus.textContent =
    "Corpus Ready";

}


function hideDiscoveryProgress() {

  discoveryProgress.classList.add(
    "hidden"
  );

}


/* =====================================================
   STATS
===================================================== */

function renderStats(
  stats
) {

  statsDiv.innerHTML = `

    <div class="stat-card">

      <span class="stat-label">
        RETRIEVED
      </span>

      <strong>
        ${stats.retrieved ?? 0}
      </strong>

      <span class="stat-description">
        Live candidates
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-label">
        DEDUPLICATED
      </span>

      <strong>
        ${stats.deduplicated ?? 0}
      </strong>

      <span class="stat-description">
        Unique papers
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-label">
        RANKED
      </span>

      <strong>
        ${stats.ranked ?? 0}
      </strong>

      <span class="stat-description">
        Relevant papers
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-label">
        ABSTRACT-ONLY
      </span>

      <strong>
        ${stats.abstract_only ?? 0}
      </strong>

      <span class="stat-description">
        Limited evidence
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-label">
        ANALYZED
      </span>

      <strong id="statAnalyzed">
        0
      </strong>

      <span class="stat-description">
        LLM analyzed
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-label">
        FAILED
      </span>

      <strong id="statFailed">
        0
      </strong>

      <span class="stat-description">
        Analysis failures
      </span>

    </div>

  `;

}


function updateAnalysisStats(
  analyzed,
  failed
) {

  const analyzedElement =
    document.querySelector(
      "#statAnalyzed"
    );

  const failedElement =
    document.querySelector(
      "#statFailed"
    );


  if (analyzedElement) {

    analyzedElement.textContent =
      analyzed;

  }


  if (failedElement) {

    failedElement.textContent =
      failed;

  }

}


/* =====================================================
   PAPER DISPLAY
===================================================== */

function renderPapers() {

  if (!discoveredPapers.length) {

    resultsDiv.innerHTML = `
      <div class="status-message">
        No papers found.
      </div>
    `;

    morePapersContainer.classList.add(
      "hidden"
    );

    return;

  }


  const topN =
    Number(
      analysisLimit.value
    );


  const papersToShow =
    discoveredPapers.slice(
      0,
      visiblePaperCount
    );


  resultsDiv.innerHTML =
    papersToShow
      .map(
        (paper, index) => {

          const isAnalysisCandidate =
            index < topN;


          return `

            <article class="paper">

              <div class="paper-rank">
                ${String(
                  index + 1
                ).padStart(2, "0")}
              </div>


              <div class="paper-content">

                <div class="paper-meta">

                  ${
                    isAnalysisCandidate
                      ? "TOP-RANKED • ANALYSIS SET"
                      : "RANKED LITERATURE"
                  }

                </div>


                <h3>
                  ${escapeHtml(
                    paper.title
                  )}
                </h3>


                <p class="authors">

                  ${
                    Array.isArray(
                      paper.authors
                    )
                      ? escapeHtml(
                          paper.authors.join(
                            ", "
                          )
                        )
                      : escapeHtml(
                          paper.authors ||
                          ""
                        )
                  }

                </p>


                <p class="abstract">

                  ${escapeHtml(
                    paper.abstract ||
                    "No abstract available."
                  )}

                </p>


                <div class="paper-footer">

                  <span class="relevance">

                    Relevance

                    <strong>
                      ${Number(
                        paper.relevance_score
                      ).toFixed(3)}
                    </strong>

                  </span>


                  <a
                    href="${escapeHtml(
                      paper.url
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Paper →
                  </a>

                </div>

              </div>

            </article>

          `;

        }
      )
      .join("");


  updateMorePapersUI();

}


/* =====================================================
   MORE PAPERS
===================================================== */

function updateMorePapersUI() {

  const total =
    discoveredPapers.length;


  const shown =
    Math.min(
      visiblePaperCount,
      total
    );


  paperDisplayInfo.textContent =
    `Showing ${shown} of ${total} papers`;


  if (shown < total) {

    morePapersContainer.classList.remove(
      "hidden"
    );


    morePapersBtn.textContent =
      `More Papers (${Math.min(
        PAPERS_PER_LOAD,
        total - shown
      )})`;

  } else {

    morePapersContainer.classList.add(
      "hidden"
    );

  }

}


morePapersBtn.addEventListener(
  "click",
  () => {

    visiblePaperCount =
      Math.min(
        visiblePaperCount +
          PAPERS_PER_LOAD,
        discoveredPapers.length
      );


    renderPapers();


    morePapersContainer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }
);


/* =====================================================
   ANALYSIS CONTROLS
===================================================== */

function updateAnalysisControls() {

  let limit =
    Number(
      analysisLimit.value
    );


  if (
    Number.isNaN(limit) ||
    limit < 1
  ) {

    limit = 1;

  }


  if (limit > MAX_ANALYSIS) {

    limit =
      MAX_ANALYSIS;

  }


  if (
    discoveredPapers.length &&
    limit > discoveredPapers.length
  ) {

    limit =
      discoveredPapers.length;

  }


  analysisLimit.value =
    limit;

  analysisLimitRange.value =
    limit;


  selectionCount.textContent =
    `Top ${limit} ranked paper${
      limit === 1
        ? ""
        : "s"
    } will be analyzed`;


  analysisNotice.textContent =
    `VELA will automatically analyze the top ${limit} ranked paper${
      limit === 1
        ? ""
        : "s"
    } based on semantic relevance.`;


  startAnalysisBtn.textContent =
    `Start Research Analysis (${limit} Paper${
      limit === 1
        ? ""
        : "s"
    })`;


  renderPapers();

}


analysisLimit.addEventListener(
  "input",
  updateAnalysisControls
);


analysisLimitRange.addEventListener(
  "input",
  () => {

    analysisLimit.value =
      analysisLimitRange.value;

    updateAnalysisControls();

  }
);


/* =====================================================
   START ANALYSIS
===================================================== */

startAnalysisBtn.addEventListener(
  "click",
  startResearchAnalysis
);


async function startResearchAnalysis() {

  const limit =
    Math.min(
      Math.max(
        Number(
          analysisLimit.value
        ) || 5,
        1
      ),
      MAX_ANALYSIS,
      discoveredPapers.length
    );


  const selectedPapers =
    discoveredPapers.slice(
      0,
      limit
    );


  if (!selectedPapers.length) {

    showError(
      "No ranked papers are available for analysis."
    );

    return;

  }


  startAnalysisBtn.disabled =
    true;


  progressSection.classList.remove(
    "hidden"
  );


  setProgressStep(
    "step-indexing",
    "Running"
  );

  setProgressStep(
    "step-analyzing",
    "Waiting"
  );

  setProgressStep(
    "step-synthesizing",
    "Waiting"
  );

  setProgressStep(
    "step-completed",
    "Waiting"
  );


  scrollToSection(
    progressSection
  );


  await wait(300);


  setProgressStep(
    "step-indexing",
    "Completed"
  );


  setProgressStep(
    "step-analyzing",
    "Running"
  );


  statusDiv.innerHTML = `
    <div class="status-message">
      VELA is analyzing the top ${limit}
      ranked paper${
        limit === 1
          ? ""
          : "s"
      }...
    </div>
  `;


  try {

    const response =
      await fetch(
        "http://127.0.0.1:8000/research/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            query:
              queryInput.value.trim(),

            papers:
              selectedPapers

          })

        }
      );


    if (!response.ok) {

      throw new Error(
        `Analysis request failed: ${response.status}`
      );

    }


    const data =
      await response.json();


    updateAnalysisStats(
      data.analyzed || 0,
      data.failed || 0
    );


    setProgressStep(
      "step-analyzing",
      "Completed"
    );


    setProgressStep(
      "step-synthesizing",
      "Running"
    );


    await wait(300);


    renderAnalysisResults(
      data
    );


    setProgressStep(
      "step-synthesizing",
      "Completed"
    );


    setProgressStep(
      "step-completed",
      "Completed"
    );


    statusDiv.innerHTML = `
      <div class="status-message success-message">
        Analysis completed —
        ${data.analyzed || 0} analyzed,
        ${data.failed || 0} failed.
      </div>
    `;


    /*
      ==================================================
      CRITICAL REDIRECT FIX
      ==================================================

      Hide BOTH:
      1. Research Corpus
      2. Analysis Progress

      This removes the long corpus from the document
      flow completely.

      Therefore Literature Analysis becomes the
      actual visible workspace.
    */


    corpusSection.classList.add(
      "hidden"
    );


    progressSection.classList.add(
      "hidden"
    );


    setActiveTab(
      "analysisResults"
    );


    /*
      Allow browser to recalculate the page layout
      after hiding the previous sections.
    */

    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            scrollToSection(
              analysisResults
            );

          }
        );

      }
    );


  } catch (error) {

    console.error(
      "VELA Analysis Error:",
      error
    );


    setProgressStep(
      "step-analyzing",
      "Failed"
    );


    statusDiv.innerHTML = `
      <div class="status-message error-message">
        Research analysis failed:
        ${escapeHtml(
          error.message
        )}
      </div>
    `;

  } finally {

    startAnalysisBtn.disabled =
      false;

  }

}


/* =====================================================
   ANALYSIS RESULTS
===================================================== */

function renderAnalysisResults(
  data
) {

  analysisResults.classList.remove(
    "hidden"
  );


  const completedAnalyses =
    (data.analyses || [])
      .filter(
        item =>
          item.status ===
          "completed"
      );


  analysisCount.textContent =
    `${data.analyzed || 0} analyzed · ${
      data.failed || 0
    } failed`;


  if (
    !completedAnalyses.length
  ) {

    analysisCards.innerHTML = `
      <div class="status-message error-message">
        No paper analyses were completed.
      </div>
    `;

  } else {

    analysisCards.innerHTML =
      completedAnalyses
        .map(
          item => {

            const analysis =
              item.analysis ||
              {};


            return `

              <article
                class="analysis-card"
              >

                <div
                  class="analysis-paper-title"
                >
                  ${escapeHtml(
                    item.title ||
                    "Untitled Paper"
                  )}
                </div>


                <div class="analysis-field">

                  <span>
                    Research Problem
                  </span>

                  <p>
                    ${escapeHtml(
                      analysis.research_problem ||
                      "INSUFFICIENT EVIDENCE"
                    )}
                  </p>

                </div>


                <div class="analysis-field">

                  <span>
                    Methodology
                  </span>

                  <p>
                    ${escapeHtml(
                      analysis.methodology ||
                      "INSUFFICIENT EVIDENCE"
                    )}
                  </p>

                </div>


                <div class="analysis-field">

                  <span>
                    Dataset / Experimental Setup
                  </span>

                  <p>
                    ${escapeHtml(
                      analysis.dataset_experimental_setup ||
                      "INSUFFICIENT EVIDENCE"
                    )}
                  </p>

                </div>


                <div
                  class="analysis-field insight-field"
                >

                  <span>
                    Key Findings / Results
                  </span>

                  <p>

                    <mark>
                      ${escapeHtml(
                        analysis.key_findings ||
                        "INSUFFICIENT EVIDENCE"
                      )}
                    </mark>

                  </p>

                </div>


                <div class="analysis-field">

                  <span>
                    Limitations
                  </span>

                  <p>
                    ${escapeHtml(
                      analysis.limitations ||
                      "INSUFFICIENT EVIDENCE"
                    )}
                  </p>

                </div>


                <div
                  class="analysis-field evidence-field"
                >

                  <span>
                    Evidence
                  </span>

                  <p>
                    ${escapeHtml(
                      analysis.evidence ||
                      "INSUFFICIENT EVIDENCE"
                    )}
                  </p>

                </div>

              </article>

            `;

          }
        )
        .join("");

  }


  renderResearchGaps(
    data
  );

}


/* =====================================================
   RESEARCH GAPS
===================================================== */

function renderResearchGaps(
  data
) {

  gapsSection.classList.remove(
    "hidden"
  );


  const literature =
    data.literature_analysis ||
    {};


  const gaps =
    literature.gaps ||
    [];


  gapCount.textContent =
    `${gaps.length} gap${
      gaps.length === 1
        ? ""
        : "s"
    }`;


  literatureSummary.innerHTML =
    escapeHtml(
      literature.literature_summary ||
      "INSUFFICIENT EVIDENCE"
    );


  if (!gaps.length) {

    gapCards.innerHTML = `
      <div class="gap-empty">
        INSUFFICIENT EVIDENCE
      </div>
    `;

    return;

  }


  gapCards.innerHTML =
    gaps
      .map(
        gap => `

          <article
            class="gap-card"
          >

            <h3>
              ${escapeHtml(
                gap.title ||
                "Potential Research Gap"
              )}
            </h3>


            <p>
              ${escapeHtml(
                gap.explanation ||
                "INSUFFICIENT EVIDENCE"
              )}
            </p>


            <div class="gap-meta">

              Confidence:

              <strong>
                ${escapeHtml(
                  gap.confidence ||
                  "Low"
                )}
              </strong>

            </div>


            <div class="gap-evidence">

              <span>
                Supporting Evidence
              </span>

              <p>
                ${escapeHtml(
                  gap.supporting_evidence ||
                  "INSUFFICIENT EVIDENCE"
                )}
              </p>

            </div>

          </article>

        `
      )
      .join("");

}


/* =====================================================
   NAVIGATION
===================================================== */

document
  .querySelectorAll(
    ".nav-tab"
  )
  .forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          const targetId =
            tab.dataset.target;


          const target =
            document.querySelector(
              `#${targetId}`
            );


          if (!target) {

            return;

          }


          /*
            RESEARCH CORPUS
          */

          if (
            targetId ===
            "corpusSection"
          ) {

            corpusSection.classList.remove(
              "hidden"
            );

            progressSection.classList.add(
              "hidden"
            );

          }


          /*
            LITERATURE ANALYSIS
          */

          if (
            targetId ===
            "analysisResults"
          ) {

            corpusSection.classList.add(
              "hidden"
            );

            progressSection.classList.add(
              "hidden"
            );

          }


          /*
            RESEARCH GAPS
          */

          if (
            targetId ===
            "gapsSection"
          ) {

            corpusSection.classList.add(
              "hidden"
            );

            progressSection.classList.add(
              "hidden"
            );

          }


          setActiveTab(
            targetId
          );


          requestAnimationFrame(
            () => {

              requestAnimationFrame(
                () => {

                  scrollToSection(
                    target
                  );

                }
              );

            }
          );

        }
      );

    }
  );


/* =====================================================
   VIEW GAPS
===================================================== */

viewGapsBtn.addEventListener(
  "click",
  () => {

    corpusSection.classList.add(
      "hidden"
    );

    progressSection.classList.add(
      "hidden"
    );


    setActiveTab(
      "gapsSection"
    );


    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            scrollToSection(
              gapsSection
            );

          }
        );

      }
    );

  }
);


/* =====================================================
   BACK TO ANALYSIS
===================================================== */

backToAnalysisBtn.addEventListener(
  "click",
  () => {

    corpusSection.classList.add(
      "hidden"
    );

    progressSection.classList.add(
      "hidden"
    );


    setActiveTab(
      "analysisResults"
    );


    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            scrollToSection(
              analysisResults
            );

          }
        );

      }
    );

  }
);


/* =====================================================
   ACTIVE TAB
===================================================== */

function setActiveTab(
  targetId
) {

  document
    .querySelectorAll(
      ".nav-tab"
    )
    .forEach(
      tab => {

        tab.classList.toggle(
          "active",
          tab.dataset.target ===
            targetId
        );

      }
    );

}


/* =====================================================
   SECTION SCROLL
===================================================== */

function scrollToSection(
  element
) {

  if (!element) {

    return;

  }


  const header =
    document.querySelector(
      ".header"
    );


  const nav =
    document.querySelector(
      ".workspace-nav"
    );


  const headerHeight =
    header
      ? header.offsetHeight
      : 0;


  const navHeight =
    nav &&
    !nav.classList.contains(
      "hidden"
    )
      ? nav.offsetHeight
      : 0;


  const extraSpace = 20;


  const targetTop =
    element.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    navHeight -
    extraSpace;


  window.scrollTo({

    top:
      Math.max(
        targetTop,
        0
      ),

    behavior:
      "smooth"

  });

}


/* =====================================================
   PROGRESS
===================================================== */

function setProgressStep(
  id,
  state
) {

  const element =
    document.querySelector(
      `#${id}`
    );


  if (!element) {

    return;

  }


  const stateElement =
    element.querySelector(
      ".step-state"
    );


  stateElement.textContent =
    state;


  element.classList.remove(
    "running",
    "completed",
    "failed"
  );


  if (
    state ===
    "Running"
  ) {

    element.classList.add(
      "running"
    );

  }


  if (
    state ===
    "Completed"
  ) {

    element.classList.add(
      "completed"
    );

  }


  if (
    state ===
    "Failed"
  ) {

    element.classList.add(
      "failed"
    );

  }

}


/* =====================================================
   RESET
===================================================== */

resetBtn.addEventListener(
  "click",
  resetInterface
);


function resetInterface() {

  queryInput.value = "";

  discoveredPapers = [];

  visiblePaperCount = 10;


  statsDiv.innerHTML = "";

  resultsDiv.innerHTML = "";

  analysisCards.innerHTML = "";

  gapCards.innerHTML = "";

  literatureSummary.innerHTML = "";


  discoverySection.classList.add(
    "hidden"
  );

  workspaceNav.classList.add(
    "hidden"
  );

  progressSection.classList.add(
    "hidden"
  );

  analysisResults.classList.add(
    "hidden"
  );

  gapsSection.classList.add(
    "hidden"
  );


  corpusSection.classList.remove(
    "hidden"
  );


  morePapersContainer.classList.add(
    "hidden"
  );


  statusDiv.innerHTML = "";


  analysisLimit.value = 5;

  analysisLimitRange.value = 5;


  setActiveTab(
    "corpusSection"
  );


  queryInput.focus();

}


/* =====================================================
   HELPERS
===================================================== */

function showError(
  message
) {

  statusDiv.innerHTML = `
    <div class="status-message error-message">
      ${escapeHtml(
        message
      )}
    </div>
  `;

}


function wait(
  ms
) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}


function escapeHtml(
  value
) {

  return String(
    value
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =====================================================
   EVENTS
===================================================== */

searchBtn.addEventListener(
  "click",
  searchPapers
);


queryInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      searchPapers();

    }

  }
);