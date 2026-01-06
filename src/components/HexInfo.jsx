import { getTerrainById } from "../data/terrainTypes";

function HexInfo({ hex }) {
  if (!hex) {
    return (
      <div className="hex-info empty">
        <p>Select a region</p>
      </div>
    );
  }

  const terrain = getTerrainById(hex.terrain);

  return (
    <div className="hex-info">
      <div className="hex-info-header">
        <div
          className="terrain-indicator"
          style={{ backgroundColor: terrain.color }}
        />
        <h3>{hex.region || "Unknown Region"}</h3>
      </div>

      <div className="hex-info-details">
        <div className="info-row">
          <span className="label">Country:</span>
          <span className="value">{hex.country || "Unknown"}</span>
        </div>
        <div className="info-row">
          <span className="label">Terrain:</span>
          <span className="value">{terrain.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Passable:</span>
          <span
            className={`value ${terrain.passable ? "passable" : "impassable"}`}
          >
            {terrain.passable ? "Yes" : "No"}
          </span>
        </div>
        <div className="info-row">
          <span className="label">Coordinates:</span>
          <span className="value">
            ({hex.q}, {hex.r})
          </span>
        </div>
      </div>

      {terrain.description && (
        <p className="terrain-description">{terrain.description}</p>
      )}
    </div>
  );
}

export default HexInfo;
