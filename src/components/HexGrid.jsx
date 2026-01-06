import React, { useState, useMemo, useCallback } from "react";
import Hexagon from "./Hexagon";
import { hexToPixel, hexKey, HEX_SIZE, hexDistance } from "../utils/hexUtils";

function HexGrid({
  hexData,
  selectedHex,
  onHexClick,
  onHexHover,
  flagsMap,
  units = {},
  pendingAttack,
}) {
  const [hoveredHex, setHoveredHex] = useState(null);

  const viewBox = useMemo(() => {
    if (!hexData || hexData.length === 0) {
      return { minX: 0, minY: 0, width: 800, height: 600 };
    }

    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    hexData.forEach((hex) => {
      const { x, y } = hexToPixel(hex.q, hex.r);
      minX = Math.min(minX, x - HEX_SIZE);
      minY = Math.min(minY, y - HEX_SIZE);
      maxX = Math.max(maxX, x + HEX_SIZE);
      maxY = Math.max(maxY, y + HEX_SIZE);
    });

    const padding = HEX_SIZE * 2;
    return {
      minX: minX - padding,
      minY: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }, [hexData]);

  const handleHexClick = useCallback(
    (hex) => {
      if (onHexClick) {
        onHexClick(hex);
      }
    },
    [onHexClick]
  );

  const handleHexHover = useCallback(
    (hex) => {
      setHoveredHex(hex ? hexKey(hex.q, hex.r) : null);
      if (onHexHover) {
        onHexHover(hex);
      }
    },
    [onHexHover]
  );

  return (
    <svg
      className="hex-grid"
      viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#333"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>

      <rect
        x={viewBox.minX}
        y={viewBox.minY}
        width={viewBox.width}
        height={viewBox.height}
        fill="#0a1628"
      />

      <g className="hexagons">
        {hexData.map((hex) => {
          const { x, y } = hexToPixel(hex.q, hex.r);
          const key = hexKey(hex.q, hex.r);

          const hasUnit = units && units[key];
          const flagUrl =
            hasUnit && flagsMap ? flagsMap[units[key].owner] : null;

          return (
            <Hexagon
              key={key}
              q={hex.q}
              r={hex.r}
              x={x}
              y={y}
              terrain={hex.terrain}
              country={hex.country}
              countryColor={hex.countryColor}
              selected={
                selectedHex && hexKey(selectedHex.q, selectedHex.r) === key
              }
              hovered={hoveredHex === key}
              onClick={handleHexClick}
              onMouseEnter={handleHexHover}
              onMouseLeave={() => handleHexHover(null)}
              flagUrl={flagUrl}
              unit={units[key]}
              isAttackTarget={
                pendingAttack &&
                pendingAttack.q === hex.q &&
                pendingAttack.r === hex.r
              }
              isPotentialTarget={
                selectedHex &&
                units[key] &&
                units[key].owner !== selectedHex.owner &&
                hexDistance(selectedHex.q, selectedHex.r, hex.q, hex.r) === 1 &&
                hoveredHex === key
              }
            />
          );
        })}
      </g>
    </svg>
  );
}

export default React.memo(HexGrid);
