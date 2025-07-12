import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  type: "teach" | "learn";
  description?: string;
};

type UserData = {
  username: string;
  email: string;
  skills: Skill[];
};

export default function MyProfile() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/users/me-full", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  if (!user) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading your profile...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <div style={{ padding: "2rem", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{user.username}'s Profile</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>{user.email}</p>

        <h3 style={{ marginBottom: "1rem" }}>🛠️ Your Skills</h3>
        {user.skills.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.skills.map((skill) => (
              <li key={skill.id} style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                <strong>{skill.name}</strong> —{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>{skill.type}</span>
                <p style={{ marginTop: "0.5rem", color: "#666" }}>{skill.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No skills posted yet.</p>
        )}
      </div>
    </div>
  );
}