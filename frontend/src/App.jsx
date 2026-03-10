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

    <div style={{ padding: "20px" }}>

      <h1 className="text-4x1 font-bold text-blue-600">Social Media Analytics Dashboard</h1>

      <h2>Posts</h2>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (

        <ul>
          {posts.map((post) => (

            <li key={post.id_posts}>

              <strong>ID:</strong> {post.id_posts} <br/>
              <strong>Content:</strong> {post.content} <br/>
              <strong>Platform:</strong> {post.platform} <br/><br/>

              <button onClick={() => runAnalysis(post.id_posts)}>
                Run Analysis
              </button>

              {scores[post.id_posts] && (
                <p>
                  <strong>Predicted Score:</strong> {scores[post.id_posts]}
                </p>
              )}

              <hr/>

            </li>

          ))}
        </ul>

      )}

    </div>

  );
}

export default App;