import { useEffect, useState } from "react";
import axios from "axios";
import MetricsChart from "./components/MetricsChart";
import AnalysisHistory from "./components/AnalysisHistory";
import MetricsCards from "./components/MetricCards";
import ScoreHistoryChart from "./components/ScoreHistoryChart";
import './App.css';
 
// ── Helpers ────────────────────────────────────────────────────────────────
function getPlatformClass(platform = "") {
  const p = platform.toLowerCase();
  if (p === "facebook")  return "facebook";
  if (p === "instagram") return "instagram";
  if (p === "twitter")   return "twitter";
  return "default";
}
 
function getPlatformIcon(platform = "") {
  const p = platform.toLowerCase();
  if (p === "facebook")  return "f";
  if (p === "instagram") return "◈";
  if (p === "twitter")   return "𝕏";
  return "●";
}
 
function getScoreClass(score) {
  if (score >= 200) return "score-pill score-high";
  if (score >= 100) return "score-pill score-medium";
  return "score-pill score-low";
}
 
// ── Component ──────────────────────────────────────────────────────────────
function App() {
  const [posts, setPosts]               = useState([]);
  const [scores, setScores]             = useState({});
  const [metrics, setMetrics]           = useState([]);
  const [history, setHistory]           = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [platformFilter, setPlatformFilter] = useState("All");
  const [loadingPosts, setLoadingPosts] = useState({});
 
  const loadPosts = () => {
    axios.get("http://localhost:5000/posts")
      .then(r => setPosts(r.data.data))
      .catch(e => console.error("Error fetching posts:", e));
  };
 
  useEffect(() => { loadPosts(); }, []);
 
  const runAnalysis = (postId) => {
    setLoadingPosts(prev => ({ ...prev, [postId]: true }));
    axios.get(`http://localhost:5000/posts/${postId}/analysis/regression`)
      .then(r => {
        setScores(prev => ({ ...prev, [postId]: r.data.data.predicted_score }));
        loadMetrics(postId);
        loadHistory(postId);
      })
      .catch(e => console.error("Error running analysis:", e))
      .finally(() => setLoadingPosts(prev => ({ ...prev, [postId]: false })));
  };
 
  const loadMetrics = (postId) => {
    if (!postId || Array.isArray(postId)) return;
    axios.get(`http://localhost:5000/metrics/${postId}`)
      .then(r => setMetrics(r.data.data))
      .catch(e => console.error("Error fetching metrics:", e));
  };
 
  const loadHistory = (postId) => {
    if (!postId || Array.isArray(postId)) return;
    axios.get(`http://localhost:5000/posts/${postId}/analysis/history`)
      .then(r => setHistory(r.data))
      .catch(e => console.error("Error loading history:", e));
  };
 
  useEffect(() => {
    if (!selectedPost) return;
    loadMetrics(selectedPost);
    loadHistory(selectedPost);
  }, [selectedPost]);
 
  useEffect(() => {
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, []);
 
  const filteredPosts = platformFilter === "All"
    ? posts
    : posts.filter(p => p.platform?.toLowerCase() === platformFilter.toLowerCase());
 
  const sortedPosts = [...filteredPosts].sort((a, b) =>
    (scores[b.id_posts] || 0) - (scores[a.id_posts] || 0)
  );
 
  const bestPostId = Object.keys(scores).length
    ? Object.entries(scores).reduce((best, cur) => cur[1] > best[1] ? cur : best)[0]
    : null;
 
  const scoreValues  = Object.values(scores);
  const totalPosts   = posts.length;
  const averageScore = scoreValues.length
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;
  const bestScore    = scoreValues.length ? Math.max(...scoreValues) : 0;
 
  const exportCSV = () => {
    const rows = [["Post ID", "Platform", "Score"],
      ...sortedPosts.map(p => [p.id_posts, p.platform, scores[p.id_posts] || "-"])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "post_analysis_report.csv";
    link.click();
  };
 
  const filters = [
    { label: "All",       value: "All",       cls: "" },
    { label: "Facebook",  value: "Facebook",  cls: "fb" },
    { label: "Instagram", value: "Instagram", cls: "ig" },
    { label: "Twitter",   value: "Twitter",   cls: "tw" },
  ];
 
  return (
    <>
      <div className="dash-root">
 
        {/* ── Header ── */}
        <header className="header">
          <div className="header-left">
            <span className="header-eyebrow">Analytics Platform · v1.0</span>
            <h1 className="header-title">Social Media<br />Analytics Dashboard</h1>
          </div>
          <div className="header-live">
            <span className="header-dot" />
            Auto-refresh · 30s
          </div>
        </header>
 
        {/* ── Summary cards ── */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Posts</div>
            <div className="summary-value">{totalPosts}</div>
            <span className="summary-icon">📄</span>
          </div>
          <div className="summary-card">
            <div className="summary-label">Average Score</div>
            <div className="summary-value">{averageScore || "—"}</div>
            <span className="summary-icon">📊</span>
          </div>
          <div className="summary-card">
            <div className="summary-label">Best Score</div>
            <div className="summary-value">{bestScore || "—"}</div>
            <span className="summary-icon">🏆</span>
          </div>
        </div>
 
        {/* ── Metrics cards (external component) ── */}
        <MetricsCards metrics={metrics} />
 
        {/* ── Posts table ── */}
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-bar" />
              Posts
            </div>
            <div className="toolbar">
              <button className="btn-export" onClick={exportCSV}>
                ↓ Export CSV
              </button>
              <div className="filter-group">
                {filters.map(f => (
                  <button
                    key={f.value}
                    className={`filter-btn ${f.cls} ${platformFilter === f.value ? "active" : ""}`}
                    onClick={() => setPlatformFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {posts.length === 0 ? (
            <div className="empty-state">// No posts found</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Platform</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPosts.map(post => (
                    <tr
                      key={post.id_posts}
                      className={[
                        post.id_posts == bestPostId ? "best-post" : "",
                        selectedPost === post.id_posts ? "selected-row" : "",
                      ].join(" ")}
                      onClick={() => setSelectedPost(post.id_posts)}
                    >
                      <td>
                        <span className="td-id">#{post.id_posts}</span>
                        {post.id_posts == bestPostId && (
                          <span className="trophy">🏆</span>
                        )}
                      </td>
                      <td>
                        <span className="td-content">{post.content}</span>
                      </td>
                      <td>
                        <span className={`platform-badge ${getPlatformClass(post.platform)}`}>
                          {getPlatformIcon(post.platform)} {post.platform}
                        </span>
                      </td>
                      <td>
                        {scores[post.id_posts] ? (
                          <span className={getScoreClass(scores[post.id_posts])}>
                            {scores[post.id_posts]}
                          </span>
                        ) : (
                          <span className="score-none">—</span>
                        )}
                      </td>
                      <td>
                        {loadingPosts[post.id_posts] ? (
                          <div className="btn-analyzing">
                            <span className="spinner" /> Analyzing...
                          </div>
                        ) : scores[post.id_posts] && selectedPost === post.id_posts ? (
                          <span className="badge-ready">✓ Ready</span>
                        ) : (
                          <button
                            className="btn-analyze"
                            onClick={e => { e.stopPropagation(); runAnalysis(post.id_posts); }}
                          >
                            Analyze →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
 
        {/* ── Charts & History ── */}
        <div className="bottom-grid">
          <MetricsChart metrics={metrics} />
          <AnalysisHistory history={history} />
        </div>
 
      </div>
    </>
  );
}
 
export default App;
