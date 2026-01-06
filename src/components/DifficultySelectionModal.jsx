import React from "react";
import "../App.css";

function DifficultySelectionModal({ onSelect }) {
  const difficulties = [
    {
      id: "easy",
      label: "EASY",
      description: "AI performs 1 action per turn. Recommended for beginners.",
      color: "#4caf50",
    },
    {
      id: "normal",
      label: "NORMAL",
      description: "AI performs 2 actions per turn. The standard challenge.",
      color: "#c9a227",
    },
    {
      id: "hard",
      label: "HARD",
      description: "AI performs 3 actions per turn. Only for veterans.",
      color: "#ff4d4d",
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="country-select-panel" style={{ maxWidth: "600px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          ⚔️ Choose Difficulty
        </h2>
        <p style={{ color: "#8ca1c4", marginBottom: "30px" }}>
          Select the level of resistance you will face:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              className="country-select-btn"
              onClick={() => onSelect(diff.id)}
              style={{
                borderLeft: `6px solid ${diff.color}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "15px 25px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: diff.color,
                  letterSpacing: "2px",
                }}
              >
                {diff.label}
              </span>
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#ccc",
                  marginTop: "5px",
                  fontWeight: "normal",
                }}
              >
                {diff.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DifficultySelectionModal;
