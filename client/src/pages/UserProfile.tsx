import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  type: string;
  description?: string;
};

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<{ username: string; skills: Skill[] } | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/users/${id}`)
      .then(res => res.json())
      .then(setUser)
      .catch(console.error);
  }, [id]);

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#111827", marginBottom: "1rem" }}>
          👤 {user.username}'s Profile
        </h2>
        <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>🛠️ Skills</h3>

        {user.skills.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No skills posted yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.skills.map((skill) => (
              <li
                key={skill.id}
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <strong style={{ fontSize: "1.1rem", color: "#111827" }}>{skill.name}</strong>{" "}
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    color: skill.type === "teach" ? "#10b981" : "#3b82f6",
                    marginLeft: "0.5rem",
                  }}
                >
                  ({skill.type})
                </span>
                {skill.description && (
                  <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>{skill.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
