import React from "react";

function ForfeitPanel({ showForfeitPanel, setShowForfeitPanel, onForfeit }) {
  return (
    <>
      <div
        onClick={() => setShowForfeitPanel(!showForfeitPanel)}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "25px",
          background: "rgba(10, 22, 40, 0.95)",
          border: "1px solid #1e3a5f",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 300,
          color: "#c9a227",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.height = "30px")}
        onMouseOut={(e) => (e.currentTarget.style.height = "25px")}
      >
        <span
          style={{
            transform: showForfeitPanel ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          ▼
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: showForfeitPanel ? "0" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "70px",
          background: "rgba(10, 22, 40, 0.98)",
          border: "1px solid #1e3a5f",
          borderTop: "none",
          borderRadius: "0 0 15px 15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 290,
          transition: "top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          padding: "10px",
        }}
      >
        <button
          onClick={onForfeit}
          style={{
            background: "#ff4d4d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
            boxShadow: "0 4px 10px rgba(255, 77, 77, 0.3)",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#ff3333";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ff4d4d";
            e.target.style.transform = "translateY(0)";
          }}
        >
          FORFEIT GAME
        </button>
      </div>
    </>
  );
}

export default ForfeitPanel;
