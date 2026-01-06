import React from "react";

function GameHUD({
  round,
  turnCountry,
  gold,
  playerCountry,
  flagsMap,
  onNextTurn,
  actionsRemaining,
}) {
  const isPlayerTurn = turnCountry === playerCountry;

  return (
    <div className="game-hud">
      <div className="hud-left">
        <div className="round-badge">ROUND {round}</div>

        <div className={`turn-indicator ${isPlayerTurn ? "player-turn" : ""}`}>
          <span className="turn-label">CURRENT TURN:</span>
          {flagsMap && flagsMap[turnCountry] && (
            <img
              src={flagsMap[turnCountry]}
              alt={turnCountry}
              style={{ width: "24px", height: "16px", borderRadius: "2px" }}
            />
          )}
          <span
            style={{
              fontWeight: "bold",
              color: isPlayerTurn ? "#4caf50" : "white",
            }}
          >
            {turnCountry || "Loading..."}
          </span>
        </div>
      </div>

      <div className="hud-right">
        {playerCountry && (
          <>
            <div
              className={`gold-display ${
                !isPlayerTurn ? "not-player-turn" : ""
              }`}
            >
              <span style={{ fontSize: "1.2rem" }}>💰</span>
              <span className="gold-amount">{gold[playerCountry] || 0}</span>
            </div>

            {isPlayerTurn && (
              <div className="actions-display">
                <span style={{ fontSize: "1rem" }}>⚡</span>
                <span>{actionsRemaining} MOVES</span>
              </div>
            )}

            {isPlayerTurn && (
              <button className="end-turn-btn" onClick={onNextTurn}>
                END TURN ⏩
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GameHUD;
