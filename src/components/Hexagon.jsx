import React from "react";
import { getHexagonPoints } from "../utils/hexUtils";
import { getTerrainById } from "../data/terrainTypes";

function Hexagon({
  q,
  r,
  x,
  y,
  terrain,
  countryColor,
  selected,
  hovered,
  country,
  onClick,
  onMouseEnter,
  onMouseLeave,
  flagUrl,
  unit,
  isAttackTarget,
  isPotentialTarget,
  isNavalAttack,
}) {
  const terrainData = getTerrainById(terrain);
  const points = getHexagonPoints(x, y);

  let fillColor = terrainData.color;
  let strokeColor = terrainData.borderColor;
  let strokeWidth = 1;

  if (countryColor && terrain !== "sea" && terrain !== "mountain") {
    fillColor = countryColor;
  }

  if (selected) {
    strokeColor = "#ffd700";
    strokeWidth = 3;
  } else if (hovered) {
    fillColor = lightenColor(fillColor, 20);
    strokeColor = "#ffffff";
    strokeWidth = 2;
  }

  const isInteractable = terrain !== "sea";

  return (
    <g
      className={`hexagon ${terrainData.passable ? "passable" : "impassable"}`}
      onClick={() =>
        isInteractable && onClick && onClick({ q, r, terrain, country })
      }
      onMouseEnter={() =>
        onMouseEnter && onMouseEnter({ q, r, terrain, country })
      }
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
      style={{ cursor: isInteractable ? "pointer" : "default" }}
      title={country || terrainData.name}
    >
      <polygon points={points} fill={fillColor} strokeWidth={strokeWidth} />
      {flagUrl && terrain !== "sea" && (
        <image
          href={flagUrl}
          x={x - 6}
          y={y - 6}
          height="12"
          width="12"
          opacity="0.7"
          style={{ pointerEvents: "none" }}
        />
      )}
      {(terrain === "city" || terrain === "capital") && (
        <circle
          cx={x}
          cy={y}
          r={terrain === "capital" ? 8 : 5}
          fill={terrain === "capital" ? "#ffd700" : "#ffffff"}
          opacity={0.8}
        />
      )}

      {unit && (
        <g style={{ pointerEvents: "none" }}>
        </g>
      )}

      {selected && (
        <text
          x={x}
          y={y - 15}
          fontSize="16"
          textAnchor="middle"
          style={{
            pointerEvents: "none",
            filter: "drop-shadow(1px 1px 2px black)",
          }}
        >
          ⚔️
        </text>
      )}

      {isAttackTarget && (
        <text
          x={x}
          y={y}
          fontSize="24"
          textAnchor="middle"
          fill="#ff4d4d"
          style={{ pointerEvents: "none", filter: "drop-shadow(0 0 5px red)" }}
        >
          💥
        </text>
      )}

      {isPotentialTarget && (
        <text
          x={x}
          y={y}
          fontSize="20"
          textAnchor="middle"
          fill="#ff4d4d"
          style={{ pointerEvents: "none", opacity: 0.8 }}
        >
          🎯
        </text>
      )}
    </g>
  );
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default React.memo(Hexagon);
