import { useEffect, useState } from "react";
import axios from "axios";
import MetricsChart from "./components/MetricsChart";
import AnalysisHistory from "./components/AnalysisHistory";
import MetricsCards from "./components/MetricCards";

function App() {

  const [posts, setPosts] = useState([]);
  const [scores, setScores] = useState({});
  const [metrics, setMetrics] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [platformFilter, setPlatformFilter] = useState("All");

  useEffect(() => {

    axios.get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });

  }, []);

  const runAnalysis = (postId) => {

    axios.get(`http://localhost:5000/posts/${postId}/analysis/regression`)
      .then((response) => {

        const predictedScore = response.data.data.predicted_score;

        console.log("Score recibido:", predictedScore, "Post:", postId);

        setScores((prev) => ({
          ...prev,
          [postId]: predictedScore
        }));

        loadMetrics(postId);
        loadHistory(postId);

      })
      .catch((error) => {
        console.error("Error running analysis:", error);
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

  const filteredPosts =
    platformFilter === "All"
      ? posts
      : posts.filter(
        (post) =>
          post.platform &&
          post.platform.toLowerCase() === platformFilter.toLowerCase()
      );

  const getScoreColor = (score) => {

    if (score >= 200) return "bg-green-500";
    if (score >= 100) return "bg-orange-500";

    return "bg-red-500";

  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Social Media Analytics Dashboard
      </h1>

      <MetricsCards metrics={metrics} />

      <div className="bg-white shadow-md rounded-lg p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Posts
        </h2>

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

              {filteredPosts.map((post) => (

                <tr
                  key={post.id_posts}
                  className="border-t hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedPost(post.id_posts)}
                >

                  <td className="p-3">{post.id_posts}</td>
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
                    {scores[post.id_posts] && selectedPost === post.id_posts ? (
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

    </div>
  );
}

export default App;