import { TERRAIN } from "../data/terrainTypes";
import { COUNTRIES } from "../data/countries";

function EditorToolbar({
  currentTerrain,
  onTerrainChange,
  currentCountry,
  onCountryChange,
  onExport,
  onClear,
  onExit,
}) {
  return (
    <div className="editor-toolbar">
      <div className="toolbar-section">
        <h3>🌍 Geography</h3>
        <div className="terrain-buttons">
          <button
            className={`terrain-btn ${
              currentTerrain === "sea" ? "active" : ""
            }`}
            onClick={() => {
              onTerrainChange("sea");
              onCountryChange("");
            }}
            style={{ borderColor: TERRAIN.SEA.color }}
          >
            <span
              className="color-box"
              style={{ background: TERRAIN.SEA.color }}
            ></span>
            Sea
          </button>
          <button
            className={`terrain-btn ${
              currentTerrain === "mountain" ? "active" : ""
            }`}
            onClick={() => {
              onTerrainChange("mountain");
              onCountryChange("");
            }}
            style={{ borderColor: TERRAIN.MOUNTAIN.color }}
          >
            <span
              className="color-box"
              style={{ background: TERRAIN.MOUNTAIN.color }}
            ></span>
            Mountain
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3>🏳️ Select Country</h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#8ca3c4",
            marginBottom: "0.5rem",
          }}
        >
          Select a country to paint land:
        </p>
        <div className="input-group">
          <select
            value={currentCountry}
            onChange={(e) => {
              onCountryChange(e.target.value);
              if (e.target.value) {
                onTerrainChange("land");
              }
            }}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "#0a1628",
              color: "white",
              border: "1px solid #3a506b",
              borderRadius: "4px",
            }}
          >
            <option value="">-- Select Country --</option>
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {currentCountry && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              background: COUNTRIES.find((c) => c.id === currentCountry)?.color,
              borderRadius: "4px",
              color: "white",
              textAlign: "center",
              fontSize: "0.9rem",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Painting with this color
          </div>
        )}
      </div>

      <div className="toolbar-section actions" style={{ marginTop: "auto" }}>
        <h3>Actions</h3>
        <button className="action-btn clear" onClick={onClear}>
          Clear Map
        </button>
        <hr
          style={{
            border: "0",
            borderTop: "1px solid #3a506b",
            margin: "1rem 0",
          }}
        />
        <button
          className="action-btn finish"
          onClick={onExit}
          style={{
            background: "#2d8a4e",
            color: "white",
            border: "none",
            padding: "0.8rem",
            width: "100%",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ✅ Finish
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
