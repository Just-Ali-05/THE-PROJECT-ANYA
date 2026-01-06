import React from "react";

function RelationsPanel({
  inspectedCountry,
  relations,
  flagsMap,
  aliveCountries = [],
}) {
  if (!inspectedCountry || !relations[inspectedCountry]) return null;

  const countryRelations = relations[inspectedCountry];

  return (
    <div className="relations-panel">
      <h3 className="relations-header">
        RELATIONS:{" "}
        <span style={{ color: "white" }}>{inspectedCountry.toUpperCase()}</span>
      </h3>
      <div className="relations-list">
        {Object.entries(countryRelations)
          .filter(([otherCountry]) => aliveCountries.includes(otherCountry))
          .map(([otherCountry, status]) => (
            <div
              key={otherCountry}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.05)",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {flagsMap[otherCountry] && (
                  <img
                    src={flagsMap[otherCountry]}
                    alt={otherCountry}
                    style={{
                      width: "20px",
                      height: "12px",
                      borderRadius: "1px",
                    }}
                  />
                )}
                <span style={{ fontSize: "0.8rem" }}>{otherCountry}</span>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: status === "war" ? "#ff4d4d" : "#4caf50",
                  textTransform: "uppercase",
                }}
              >
                {status}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RelationsPanel;
