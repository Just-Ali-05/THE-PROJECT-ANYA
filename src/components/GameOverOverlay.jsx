import React from "react";

function GameOverOverlay({
  gameResult,
  gameOverMessage,
  showMenuButton,
  onReturnToMenu,
}) {
  return (
    <div
      className="game-over-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <h1
        style={{
          color: gameResult === "victory" ? "#4caf50" : "#ff4d4d",
          fontSize: "5rem",
          textShadow:
            gameResult === "victory"
              ? "0 0 20px rgba(76, 175, 80, 0.5)"
              : "0 0 20px rgba(255, 77, 77, 0.5)",
          margin: 0,
          fontWeight: "900",
          letterSpacing: "5px",
        }}
      >
        {gameResult === "victory" ? "VICTORY" : "DEFEAT"}
      </h1>
      <p
        style={{
          color: "#8ca1c4",
          fontSize: "1.2rem",
          marginTop: "20px",
          fontFamily: '"Cinzel", serif',
          fontStyle: "italic",
        }}
      >
        {gameOverMessage}
      </p>

      {showMenuButton && (
        <button
          onClick={onReturnToMenu}
          style={{
            marginTop: "40px",
            padding: "12px 30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            background: "#c9a227",
            color: "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(201, 162, 39, 0.4)",
            animation: "fadeIn 1s ease-out",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          RETURN TO MAIN MENU 🏠
        </button>
      )}
    </div>
  );
}

export default GameOverOverlay;
