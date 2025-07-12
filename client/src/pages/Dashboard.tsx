import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostSkillModal from "../components/PostSkillModal";

type Skill = {
  id: number;
  name: string;
  type: "teach" | "learn";
  description?: string;
  user_id: number;
  username?: string;
};

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [matches, setMatches] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
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
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Top Right Profile Link */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <a
          href="/my-profile"
          style={{
            textDecoration: "none",
            color: "#1e40af",
            fontWeight: "600",
            fontSize: "0.95rem",
            backgroundColor: "#f3f4f6",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(4, 11, 114, 0.06)",
            transition: "all 0.2s ease-in-out",
          }}
        >
          My Profile
        </a>
      </div>

      {/* Main Card */}
      <div
        className="card"
        style={{
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            fontSize: "1.8rem",
            color: "#111827",
          }}
        >
          Welcome, {username} 👋
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.05rem",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Your Skill Swap Dashboard
        </p>

        {/* Buttons */}
        <div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.9rem",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Post New Skill
          </button>

          <button
            onClick={fetchMatches}
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "8px",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔍 View Skill Matches
          </button>
        </div>

        {/* Logout Button */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Matched Skills */}
        {matches.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.3rem", color: "#1f2937" }}>
              🎯 Matched Skills
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {matches.map((skill) => (
                <li
                  key={`match-${skill.id}`}
                  style={{
                    background: "#f0fdf4",
                    padding: "1rem",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong style={{ fontSize: "1.1rem", color: "#047857" }}>{skill.name}</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#065f46" }}>({skill.type})</span>
                  {skill.description && (
                    <p style={{ marginTop: "0.5rem", color: "#374151" }}>{skill.description}</p>
                  )}
                  <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
                    👤 Posted by:{" "}
                    <a
                      href={`/profile/${skill.user_id}`}
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                     {skill.username || "View Profile"}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <PostSkillModal onClose={handlePostSuccess} />}
    </div>
  );
}