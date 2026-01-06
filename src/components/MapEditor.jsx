import { useState, useEffect, useCallback } from "react";
import HexGrid from "./HexGrid";
import EditorToolbar from "./EditorToolbar";
import { generateEditorGrid } from "../utils/gridGenerator";
import { getCountryById } from "../data/countries";

function MapEditor({ initialData, onExit, onSave, flagsMap }) {
  const [gridData, setGridData] = useState([]);
  const [currentTerrain, setCurrentTerrain] = useState(null);
  const [currentCountry, setCurrentCountry] = useState("");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setGridData(initialData);
    } else {
      const initialGrid = generateEditorGrid();
      setGridData(initialGrid);
    }
  }, [initialData]);

  const paintHex = useCallback(
    (hex) => {
      if (!currentTerrain && !currentCountry) {
        return;
      }

      setGridData((prevGrid) => {
        return prevGrid.map((h) => {
          if (h.q === hex.q && h.r === hex.r) {
            let countryColor = h.countryColor;

            if (currentTerrain === "sea" || currentTerrain === "mountain") {
              return {
                ...h,
                terrain: currentTerrain,
                country: "",
                countryColor: null,
              };
            } else {
              const countryData = getCountryById(currentCountry);
              const color = countryData ? countryData.color : h.countryColor;
              const countryName = countryData ? countryData.name : h.country;

              return {
                ...h,
                terrain: "land",
                country: countryName,
                countryColor: color,
              };
            }
          }
          return h;
        });
      });
    },
    [currentTerrain, currentCountry]
  );

  const handleHexClick = (hex) => {
    paintHex(hex);
  };

  const handleHexHover = (hex) => {
    if (isMouseDown && hex && !isPanning) {
      paintHex(hex);
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      setIsMouseDown(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    setZoom((prev) => {
      const newZoom = prev - e.deltaY * 0.001;
      return Math.min(Math.max(newZoom, 0.4), 3);
    });
  };

  const handleClearConfirm = () => {
    setGridData(generateEditorGrid());
    setShowClearConfirm(false);
  };

  return (
    <div
      className="map-editor"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="editor-sidebar">
        <EditorToolbar
          currentTerrain={currentTerrain}
          onTerrainChange={setCurrentTerrain}
          currentCountry={currentCountry}
          onCountryChange={setCurrentCountry}
          onExit={() => {
            console.log("MAP DATA FOR EXPORT:", JSON.stringify(gridData));
            if (onSave) {
              onSave(gridData);
            } else {
              onExit();
            }
          }}
          onClear={() => setShowClearConfirm(true)}
        />

        <div className="editor-instructions">
          <h4>📝 How to Use?</h4>
          <ul>
            <li>
              Select <strong>Geography</strong> (Sea/Mountain) or{" "}
              <strong>Country</strong>.
            </li>
            <li>
              <strong>Hold Left Click</strong> to paint.
            </li>
            <li>
              <strong>Right Click + Drag</strong> to pan.
            </li>
            <li>
              <strong>Scroll</strong> to zoom.
            </li>
            <li>Export your map as JSON when finished.</li>
          </ul>
        </div>
      </div>

      <div
        className="editor-grid-container"
        style={{
          overflow: "hidden",
          cursor: isPanning ? "grabbing" : "default",
        }}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isPanning ? "none" : "transform 0.1s ease-out",
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <HexGrid
            hexData={gridData}
            onHexClick={handleHexClick}
            onHexHover={handleHexHover}
            flagsMap={flagsMap}
          />
        </div>
      </div>

      {showClearConfirm && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div
            className="country-select-panel"
            style={{ maxWidth: "400px", textAlign: "center" }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
              ⚠️ Clear Map?
            </h2>
            <p
              style={{
                color: "#8ca1c4",
                marginBottom: "25px",
                fontSize: "1.1rem",
              }}
            >
              Are you sure you want to completely clear the map? This action
              cannot be undone.
            </p>
            <div
              style={{ display: "flex", gap: "15px", justifyContent: "center" }}
            >
              <button
                onClick={handleClearConfirm}
                className="action-btn clear"
                style={{ margin: 0, padding: "12px 24px", flex: 1 }}
              >
                CLEAR
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="action-btn"
                style={{
                  margin: 0,
                  padding: "12px 24px",
                  flex: 1,
                  background: "#2a3c55",
                  color: "white",
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapEditor;
