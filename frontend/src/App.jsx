import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [posts, setPosts] = useState([]);
  const [scores, setScores] = useState({});

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

        setScores((prev) => ({
          ...prev,
          [postId]: predictedScore
        }));

      })
      .catch((error) => {
        console.error("Error running analysis:", error);
      });

  };

  return (
  <div className="min-h-screen bg-gray-100 p-8">

    <h1 className="text-4xl font-bold mb-8 text-gray-800">
      Social Media Analytics Dashboard
    </h1>

    <div className="bg-white shadow-md rounded-lg p-6">

      <h2 className="text-2xl font-semibold mb-4">
        Posts
      </h2>

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

            {posts.map((post) => (

              <tr key={post.id_posts} className="border-t">

                <td className="p-3">{post.id_posts}</td>
                <td className="p-3">{post.content}</td>
                <td className="p-3">{post.platform}</td>

                <td className="p-3">
                  {scores[post.id_posts] || "-"}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => runAnalysis(post.id_posts)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Run Analysis
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  </div>
);
}

export default App;