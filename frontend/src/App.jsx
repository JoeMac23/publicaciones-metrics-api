import { useEffect, useState } from "react";
import axios from "axios";
import MetricsChart from "./components/MetricsChart";
import AnalysisHistory from "./components/AnalysisHistory";
import MetricsCards from "./components/MetricCards";
import ScoreHistoryChart from "./components/ScoreHistoryChart";

function App() {

  const [posts, setPosts] = useState([]);
  const [scores, setScores] = useState({});
  const [metrics, setMetrics] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [platformFilter, setPlatformFilter] = useState("All");
  const [loadingPosts, setLoadingPosts] = useState({});

  const loadPosts = () => {

    axios.get("http://localhost:5000/posts")
      .then((response) => {

        setPosts(response.data.data);

      })
      .catch((error) => {

        console.error("Error fetching posts:", error);

      });

  };


  useEffect(() => {

    loadPosts();

  }, []);

  const runAnalysis = (postId) => {

    setLoadingPosts((prev) => ({
      ...prev,
      [postId]: true
    }));

    axios.get(`http://localhost:5000/posts/${postId}/analysis/regression`)
      .then((response) => {

        const predictedScore = response.data.data.predicted_score;

        setScores((prev) => ({
          ...prev,
          [postId]: predictedScore
        }));

        loadMetrics(postId);
        loadHistory(postId);

      })
      .catch((error) => {
        console.error("Error running analysis:", error);
      })
      .finally(() => {

        setLoadingPosts((prev) => ({
          ...prev,
          [postId]: false
        }));

      });

  };

  const loadMetrics = (postId) => {

    if (!postId || Array.isArray(postId)) return;

    console.log("loadMetrics called with:", postId);

    axios.get(`http://localhost:5000/metrics/${postId}`)
      .then((response) => {

        setMetrics(response.data.data);

      })
      .catch((error) => {

        console.error("Error fetching metrics:", error);

      });

  };

  const loadHistory = (postId) => {

    if (!postId || Array.isArray(postId)) return;

    console.log("loadHistory called with:", postId);

    axios.get(`http://localhost:5000/posts/${postId}/analysis/history`)
      .then((response) => {

        setHistory(response.data);

      })
      .catch((error) => {

        console.error("Error loading history:", error);

      });

  };

  useEffect(() => {

    if (!selectedPost) return;

    loadMetrics(selectedPost);
    loadHistory(selectedPost);

  }, [selectedPost]);

  useEffect(() => {

    const interval = setInterval(() => {

      loadPosts();

    }, 30000);

    return () => clearInterval(interval);

  }, []);


  const filteredPosts =
    platformFilter === "All"
      ? posts
      : posts.filter(
        (post) =>
          post.platform &&
          post.platform.toLowerCase() === platformFilter.toLowerCase()
      );


  const sortedPosts = [...filteredPosts].sort((a, b) => {

    const scoreA = scores[a.id_posts] || 0;
    const scoreB = scores[b.id_posts] || 0;

    return scoreB - scoreA;

  });

  const getScoreColor = (score) => {

    if (score >= 200) return "bg-green-500";
    if (score >= 100) return "bg-orange-500";

    return "bg-red-500";

  };

  const bestPostId = Object.keys(scores).length
    ? Object.entries(scores).reduce((best, current) =>
      current[1] > best[1] ? current : best
    )[0]
    : null;

  const exportCSV = () => {

    const headers = ["Post ID", "Platform", "Score"];

    const rows = sortedPosts.map((post) => [
      post.id_posts,
      post.platform,
      scores[post.id_posts] || "-"
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "post_analysis_report.csv";

    link.click();

  };


  const totalPosts = posts.length;

  const scoreValues = Object.values(scores);

  const averageScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0;

  const bestScore =
    scoreValues.length > 0
      ? Math.max(...scoreValues)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Social Media Analytics Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-gray-500 text-sm">Total Posts</h3>
          <p className="text-3xl font-bold">{totalPosts}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-gray-500 text-sm">Average Score</h3>
          <p className="text-3xl font-bold">{averageScore}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-gray-500 text-sm">Best Score</h3>
          <p className="text-3xl font-bold">{bestScore}</p>
        </div>

      </div>

      <MetricsCards metrics={metrics} />

      <div className="bg-white shadow-md rounded-lg p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Posts
        </h2>

        <button
          onClick={exportCSV}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>

        <p className="text-sm text-gray-500 mb-4">
          Auto-refresh every 30 seconds
        </p>


        <div className="flex gap-4 mb-4">

          <button
            onClick={() => setPlatformFilter("All")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            All
          </button>

          <button
            onClick={() => setPlatformFilter("Facebook")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Facebook
          </button>

          <button
            onClick={() => setPlatformFilter("Instagram")}
            className="px-4 py-2 bg-pink-500 text-white rounded"
          >
            Instagram
          </button>

          <button
            onClick={() => setPlatformFilter("Twitter")}
            className="px-4 py-2 bg-sky-500 text-white rounded"
          >
            Twitter
          </button>

        </div>

        {posts.length === 0 ? (
          <p>No posts found</p>
        ) : (

          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Content</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {sortedPosts.map((post) => (

                <tr
                  key={post.id_posts}
                  className={`border-t cursor-pointer ${post.id_posts == bestPostId
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSelectedPost(post.id_posts)}
                >

                  <td className="p-3">
                    {post.id_posts}

                    {post.id_posts == bestPostId && (
                      <span className="ml-2 text-yellow-600 font-bold">
                        🏆
                      </span>
                    )}

                  </td>
                  <td className="p-3">{post.content}</td>
                  <td className="p-3">{post.platform}</td>

                  <td className="p-3">
                    {scores[post.id_posts] ? (
                      <span className={`${getScoreColor(scores[post.id_posts])} text-white px-3 py-1 rounded`}>
                        {scores[post.id_posts]}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3">
                    {loadingPosts[post.id_posts] ? (

                      <span className="bg-yellow-500 text-white px-4 py-2 rounded">
                        Analyzing...
                      </span>

                    ) : scores[post.id_posts] && selectedPost === post.id_posts ? (

                      <span className="bg-green-500 text-white px-3 py-1 rounded">
                        Score Ready
                      </span>

                    ) : (

                      <button
                        onClick={() => runAnalysis(post.id_posts)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Analyze
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      <MetricsChart metrics={metrics} />
      <AnalysisHistory history={history} />
      <AnalysisHistory history={history} />

    </div>
  );
}

export default App;