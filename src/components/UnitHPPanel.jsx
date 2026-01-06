import React from "react";
import { hexKey } from "../utils/hexUtils";

function UnitHPPanel({ hoveredHex, units }) {
  if (!hoveredHex || !units[hexKey(hoveredHex.q, hoveredHex.r)]) return null;

  const unit = units[hexKey(hoveredHex.q, hoveredHex.r)];

  return (
    <div className="unit-hp-panel">
      <div className="unit-hp-content">
        <div className="unit-hp-header">
          <span>UNIT HP</span>
          <span>{unit.hp}/100</span>
        </div>
        <div className="unit-hp-bar-bg">
          <div
            className="unit-hp-bar-fill"
            style={{
              width: `${unit.hp}%`,
              background: unit.hp > 50 ? "#4caf50" : "#ff4d4d",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UnitHPPanel;
