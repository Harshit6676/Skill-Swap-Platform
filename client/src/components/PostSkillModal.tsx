import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function PostSkillModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("teach");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/skills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type, description }),
    });

    if (res.ok) {
      alert("Skill posted!");
      onClose();
    } else {
      alert("Error posting skill");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Post a Skill</h2>
        <input
          type="text"
          placeholder="Skill Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="teach">Can Teach</option>
          <option value="learn">Want to Learn</option>
        </select>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleSubmit}>Post</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}