import React from "react";

function Sidebar({
  mode,
  isMobileMenuOpen,
  onReturnToMenu,
  onPlayClick,
  setMode,
  setIsMobileMenuOpen,
}) {
  return (
    <div className={`app-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
      <h1
        className="app-title"
        onClick={() => {
          onReturnToMenu();
          setIsMobileMenuOpen(false);
        }}
        style={{ cursor: "pointer" }}
        title="Return to Main Menu"
      >
        THE PROJECT A.N.Y.A.
      </h1>
      <nav className="app-nav">
        <button
          className={`nav-btn ${mode === "play" ? "active" : ""}`}
          onClick={() => {
            onPlayClick();
            setIsMobileMenuOpen(false);
          }}
        >
          🎮 Play
        </button>
        <button
          className={`nav-btn ${mode === "editor" ? "active" : ""}`}
          onClick={() => {
            setMode("editor");
            setIsMobileMenuOpen(false);
          }}
        >
          ✏️ Map Editor
        </button>
      </nav>
      <div className="sidebar-footer">v1.2.0 RC</div>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          fontSize: "0.8rem",
          color: "#8ca1c4",
        }}
      >
        <p>
          🖱️ <strong>Scroll</strong> to Zoom
        </p>
        <p>
          🖱️ <strong>Right Click + Drag</strong> to Pan
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
