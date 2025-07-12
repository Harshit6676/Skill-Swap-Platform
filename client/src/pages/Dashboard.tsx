import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostSkillModal from "../components/PostSkillModal";

type Skill = {
  id: number;
  name: string;
  type: "teach" | "learn";
  description?: string;
};

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [matches, setMatches] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    // Fetch user info
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

    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/skills/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSkills(data);
    }
  };

  const fetchMatches = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/skills/matches", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setMatches(data);
    } else {
      alert("Failed to load matches");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePostSuccess = () => {
    setShowModal(false);
    fetchSkills();
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <div
        className="card"
        style={{
          padding: "2rem",
          boxShadow: "0 0 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Welcome, {username} 👋
        </h2>
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#555" }}>
          Your Skill Swap Dashboard
        </p>

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.8rem",
              borderRadius: "6px",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "bold",
              border: "none",
            }}
          >
            + Post New Skill
          </button>

          <button
            onClick={fetchMatches}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "6px",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: "bold",
              border: "none",
            }}
          >
            🔍 View Skill Matches
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "6px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {skills.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Your Skills</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong>{skill.name}</strong> —{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>{skill.type}</span>
                  <p style={{ marginTop: "0.5rem", color: "#666" }}>{skill.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {matches.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>🎯 Matched Skills</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {matches.map((skill) => (
                <li
                  key={`match-${skill.id}`}
                  style={{
                    background: "#e0f7fa",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong>{skill.name}</strong> —{" "}
                  <span style={{ fontStyle: "italic", color: "#00796b" }}>{skill.type}</span>
                  <p style={{ marginTop: "0.5rem", color: "#444" }}>{skill.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showModal && <PostSkillModal onClose={handlePostSuccess} />}
    </div>
  );
}