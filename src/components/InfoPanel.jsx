import React from "react";

function InfoPanel({ hoveredHex, flagsMap }) {
  if (!hoveredHex) return null;

  return (
    <div className="info-panel-top-right">
      <div className="info-content">
        {hoveredHex.country ? (
          <div
            className="info-country"
            style={{
              color: hoveredHex.countryColor,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {flagsMap[hoveredHex.country] && (
              <img
                src={flagsMap[hoveredHex.country]}
                alt={hoveredHex.country}
                style={{
                  width: "24px",
                  height: "16px",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            )}
            {hoveredHex.country}
          </div>
        ) : (
          <div className="info-terrain">
            {hoveredHex.terrain === "sea"
              ? "Sea"
              : hoveredHex.terrain === "mountain"
              ? "Mountain"
              : "Land"}
          </div>
        )}
      </div>
    </div>
  );
}

export default InfoPanel;
