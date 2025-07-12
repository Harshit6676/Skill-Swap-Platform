import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    fetch("http://localhost:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "2rem" }}>
        <h2 style={{ textAlign: "center" }}>Welcome, {username} 👋</h2>
        <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
          Here’s your skill swap dashboard.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={() => alert("Post Skill modal coming soon!")}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            + Post New Skill
          </button>
          <button
            onClick={() => alert("Matches coming soon!")}
            style={{ width: "100%" }}
          >
            🔍 View Skill Matches
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={handleLogout} style={{ background: "#ef4444" }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}