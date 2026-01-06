import { useState, useEffect } from "react";
import HexGrid from "./HexGrid";
import MapEditor from "./MapEditor";
import CountrySelectionModal from "./CountrySelectionModal";
import "../App.css";
import { getHydratedEuropeGrid } from "../utils/mapHydrator";

function Main() {
  const [mode, setMode] = useState("menu");
  const [gameMapData, setGameMapData] = useState(() => getHydratedEuropeGrid());
  const [hoveredHex, setHoveredHex] = useState(null);
  const [playerCountry, setPlayerCountry] = useState(null);
  const [flagsMap, setFlagsMap] = useState({});

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags"
        );
        if (!response.ok) throw new Error("Failed to fetch flags");
        const data = await response.json();

        const mapping = {};
        const nameToFlag = {};

        data.forEach((country) => {
          nameToFlag[country.name.common] = country.flags.svg;
        });

        const countryMapping = {
          "United Kingdom": "United Kingdom",
          France: "France",
          USA: "United States",
          Poland: "Poland",
          Belgium: "Belgium",
          Netherlands: "Netherlands",
          Norway: "Norway",
          Denmark: "Denmark",
          Luxembourg: "Luxembourg",
          Greece: "Greece",
          Czechoslovakia: "Czechia",
          Yugoslavia: "Serbia",
          Germany: "Germany",
          Italy: "Italy",
          Hungary: "Hungary",
          Romania: "Romania",
          Bulgaria: "Bulgaria",
          Slovakia: "Slovakia",
          Finland: "Finland",
          Spain: "Spain",
          Portugal: "Portugal",
          Sweden: "Sweden",
          Switzerland: "Switzerland",
          Turkey: "Turkey",
          Ireland: "Ireland",
          "Soviet Union (USSR)": "Russia",
        };

        Object.keys(countryMapping).forEach((myCountryName) => {
          const apiName = countryMapping[myCountryName];
          if (nameToFlag[apiName]) {
            mapping[myCountryName] = nameToFlag[apiName];
          }
        });

        setFlagsMap(mapping);
      } catch (error) {
        console.error("Error fetching flags:", error);
      }
    };

    fetchFlags();
  }, []);

  const handleMapSave = (newMapData) => {
    setGameMapData(newMapData);
    setMode("menu");
  };

  const handleEditorExit = () => {
    setMode("menu");
  };

  const handleHexHover = (hex) => {
    setHoveredHex(hex);
  };

  const handlePlayClick = () => {
    if (mode === "play" && !playerCountry) {
      setMode("menu");
    } else {
      setMode("play");
      setPlayerCountry(null);
    }
  };

  return (
    <div className="app-container">
      {mode !== "editor" && (
        <div className="app-sidebar">
          <h1
            className="app-title"
            onClick={() => setMode("menu")}
            style={{ cursor: "pointer" }}
            title="Return to Main Menu"
          >
            THE PROJECT A.N.Y.A.
          </h1>
          <nav className="app-nav">
            <button
              className={`nav-btn ${mode === "play" ? "active" : ""}`}
              onClick={handlePlayClick}
            >
              🎮 Play
            </button>
            <button
              className={`nav-btn ${mode === "editor" ? "active" : ""}`}
              onClick={() => setMode("editor")}
            >
              ✏️ Map Editor
            </button>
          </nav>
          <div className="sidebar-footer">v1.2.0 RC</div>
        </div>
      )}

      <div className="app-content">
        {mode === "editor" ? (
          <MapEditor
            initialData={gameMapData}
            onSave={handleMapSave}
            onExit={handleEditorExit}
          />
        ) : (
          <div className="play-mode">
            <div
              className="map-container"
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "#0a1628",
              }}
            >
              <HexGrid
                hexData={gameMapData}
                onHexHover={handleHexHover}
                flagsMap={flagsMap}
              />
            </div>

            {mode === "play" && !playerCountry && (
              <CountrySelectionModal
                onSelect={(country) => setPlayerCountry(country)}
                availableCountries={gameMapData}
              />
            )}

            {hoveredHex && (
              <div className="info-panel-top-right">
                <div className="info-content">
                  {hoveredHex.country ? (
                    <div
                      className="info-country"
                      style={{ color: hoveredHex.countryColor }}
                    >
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
