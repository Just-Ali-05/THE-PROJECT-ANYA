import { useState, useEffect, useMemo, useCallback } from "react";
import HexGrid from "./components/HexGrid";
import MapEditor from "./components/MapEditor";
import CountrySelectionModal from "./components/CountrySelectionModal";
import DifficultySelectionModal from "./components/DifficultySelectionModal";
import GameHUD from "./components/GameHUD";
import RelationsPanel from "./components/RelationsPanel";
import Sidebar from "./components/Sidebar";
import ForfeitPanel from "./components/ForfeitPanel";
import RecruitMessage from "./components/RecruitMessage";
import InfoPanel from "./components/InfoPanel";
import UnitHPPanel from "./components/UnitHPPanel";
import GameOverOverlay from "./components/GameOverOverlay";
import "./App.css";
import { getHydratedEuropeGrid } from "./utils/mapHydrator";
import { useGameLogic } from "./hooks/useGameLogic";
import { useFlags } from "./hooks/useFlags";

function App() {
  const [mode, setMode] = useState("menu");
  const [gameMapData, setGameMapData] = useState([]);
  const [baseMapData, setBaseMapData] = useState([]);
  const [hoveredHex, setHoveredHex] = useState(null);

  useEffect(() => {
    const initialData = getHydratedEuropeGrid();
    setGameMapData(initialData);
    setBaseMapData(initialData);
  }, []);

  const flagsMap = useFlags();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [inspectedCountry, setInspectedCountry] = useState(null);
  const [holdTimer, setHoldTimer] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showMenuButton, setShowMenuButton] = useState(false);
  const [showRecruitMessage, setShowRecruitMessage] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [showForfeitPanel, setShowForfeitPanel] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  const {
    turn,
    round,
    gold,
    units,
    turnOrder,
    selectedUnit,
    relations,
    initializeGame,
    handleHexClick: handleGameHexClick,
    nextTurn,
    executeAITurn,
    actionsRemaining,
    pendingAttack,
    playerCountry,
    setPlayerCountry,
  } = useGameLogic(gameMapData, difficulty);

  const aliveCountries = useMemo(() => {
    return [
      ...new Set(gameMapData.filter((h) => h.country).map((h) => h.country)),
    ];
  }, [gameMapData]);

  useEffect(() => {
    if (mode === "play" && playerCountry && !gameOver) {
      const playerHexes = gameMapData.filter(
        (h) => h.country === playerCountry
      );

      if (playerHexes.length === 0) {
        setGameResult("defeat");
        setGameOverMessage(
          "Your nation has fallen. History will remember your struggle."
        );
        setGameOver(true);
        setTimeout(() => setShowMenuButton(true), 3000);
      } else if (
        aliveCountries.length === 1 &&
        aliveCountries[0] === playerCountry
      ) {
        setGameResult("victory");
        setGameOverMessage(
          "All hail the new ruler of the world! Your empire spans the globe."
        );
        setGameOver(true);
        setTimeout(() => setShowMenuButton(true), 3000);
      }
    }

    if (mode === "play" && turnOrder.length > 0 && playerCountry && !gameOver) {
      const currentCountry = turnOrder[turn];
      if (currentCountry && currentCountry !== playerCountry) {
        console.log(`Starting AI Turn for ${currentCountry}...`);

        const timer = setTimeout(() => {
          const aiUpdates = executeAITurn(currentCountry, gameMapData);

          if (aiUpdates && aiUpdates.length > 0) {
            setGameMapData((prevData) => {
              let newData = [...prevData];
              aiUpdates.forEach((update) => {
                if (update.action === "capture") {
                  const representativeHex = newData.find(
                    (rh) => rh.country === update.country
                  );
                  const countryColor = representativeHex
                    ? representativeHex.countryColor
                    : "#ccc";
                  newData = newData.map((h) => {
                    if (h.q === update.q && h.r === update.r) {
                      return { ...h, country: update.country, countryColor };
                    }
                    return h;
                  });
                }
              });
              return newData;
            });
          }

          nextTurn(gameMapData);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [
    mode,
    turn,
    playerCountry,
    turnOrder,
    gameMapData,
    executeAITurn,
    nextTurn,
    aliveCountries,
    gameOver,
  ]);

  const handleMapSave = (newMapData) => {
    setBaseMapData(newMapData);
    setGameMapData(newMapData);
    setMode("menu");
  };

  const handleReturnToMenu = () => {
    setMode("menu");
    setGameOver(false);
    setShowMenuButton(false);
    setPlayerCountry(null);
    setGameMapData(baseMapData);
    setShowRecruitMessage(true);
    setShowForfeitPanel(false);
  };

  const handleEditorExit = () => {
    handleReturnToMenu();
  };

  const handleHexHover = useCallback(
    (hex) => {
      if (!isPanning) {
        setHoveredHex(hex);
      }
    },
    [isPanning]
  );

  const handlePlayClick = () => {
    setGameOver(false);
    setGameResult(null);
    setShowMenuButton(false);
    setShowRecruitMessage(false);
    setShowForfeitPanel(false);
    setGameOverMessage("");

    setGameMapData(baseMapData);
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setShowDifficultyModal(false);
    setMode("play");
  };

  const handleForfeit = () => {
    setGameResult("defeat");
    setGameOverMessage("COWARDS HAVE NO PLACE HERE");
    setGameOver(true);
    setShowForfeitPanel(false);
    setTimeout(() => {
      setShowMenuButton(true);
    }, 3000);
  };

  const handleSelectCountry = (countryName) => {
    initializeGame(gameMapData, countryName);
  };

  const handleHexClick = useCallback(
    (hex) => {
      if (mode === "play" && playerCountry) {
        const currentTurnCountry = turnOrder[turn];
        if (currentTurnCountry !== playerCountry) return;

        const result = handleGameHexClick(hex, gameMapData);

        if (result && result.action === "capture") {
          setGameMapData((prevData) => {
            const representativeHex = prevData.find(
              (rh) => rh.country === result.country
            );
            const countryColor = representativeHex
              ? representativeHex.countryColor
              : "#ccc";

            return prevData.map((h) => {
              if (h.q === result.q && h.r === result.r) {
                return {
                  ...h,
                  country: result.country,
                  countryColor: countryColor,
                };
              }
              return h;
            });
          });
        }

        if (result && result.autoEnd) {
          console.log("Actions exhausted. Passing turn...");
          setTimeout(() => nextTurn(gameMapData), 500);
        }
      }
    },
    [
      mode,
      playerCountry,
      turnOrder,
      turn,
      handleGameHexClick,
      gameMapData,
      nextTurn,
    ]
  );

  const handleEndTurn = useCallback(() => {
    nextTurn(gameMapData);
  }, [nextTurn, gameMapData]);

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (e.button === 0 && hoveredHex) {
      const country = hoveredHex.country;
      if (country) {
        const timer = setTimeout(() => {
          setInspectedCountry(country);
        }, 500);
        setHoldTimer(timer);
      }
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
    setIsPanning(false);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setInspectedCountry(null);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      setStartPan({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });

      if (hoveredHex && hoveredHex.country) {
        const timer = setTimeout(() => {
          setInspectedCountry(hoveredHex.country);
        }, 600);
        setHoldTimer(timer);
      }
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - startPan.x,
        y: touch.clientY - startPan.y,
      });
      if (holdTimer) {
        clearTimeout(holdTimer);
        setHoldTimer(null);
      }
    } else if (e.touches.length === 2 && lastTouchDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - lastTouchDistance;
      setZoom((prev) => {
        const nextZoom = prev + delta * 0.01;
        return Math.min(Math.max(nextZoom, 0.4), 3);
      });
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setInspectedCountry(null);
  };

  const handleWheel = (e) => {
    setZoom((prev) => {
      const newZoom = prev - e.deltaY * 0.001;
      return Math.min(Math.max(newZoom, 0.4), 3);
    });
  };

  return (
    <div className="app-container">
      {mode !== "editor" && !(mode === "play" && playerCountry) && (
        <Sidebar
          mode={mode}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onReturnToMenu={handleReturnToMenu}
          onPlayClick={handlePlayClick}
          setMode={setMode}
        />
      )}

      <div className="app-content">
        {mode === "editor" ? (
          <MapEditor
            initialData={baseMapData}
            onSave={handleMapSave}
            onExit={handleEditorExit}
            flagsMap={flagsMap}
          />
        ) : (
          <div
            className="play-mode"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onContextMenu={(e) => e.preventDefault()}
          >
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
            {mode === "play" && playerCountry && (
              <GameHUD
                round={round}
                turnCountry={turnOrder[turn]}
                gold={gold}
                playerCountry={playerCountry}
                flagsMap={flagsMap}
                onNextTurn={handleEndTurn}
                actionsRemaining={actionsRemaining}
              />
            )}

            {mode === "play" &&
              inspectedCountry &&
              aliveCountries.includes(inspectedCountry) && (
                <RelationsPanel
                  inspectedCountry={inspectedCountry}
                  relations={relations}
                  flagsMap={flagsMap}
                  aliveCountries={aliveCountries}
                />
              )}

            <div
              className="map-container"
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "#0a1628",
                cursor: isPanning ? "grabbing" : "default",
              }}
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
                  hexData={gameMapData}
                  onHexHover={handleHexHover}
                  onHexClick={handleHexClick}
                  selectedHex={selectedUnit}
                  flagsMap={flagsMap}
                  units={units}
                  pendingAttack={pendingAttack}
                />
              </div>
            </div>

            {mode === "play" && playerCountry && !gameOver && (
              <ForfeitPanel
                showForfeitPanel={showForfeitPanel}
                setShowForfeitPanel={setShowForfeitPanel}
                onForfeit={handleForfeit}
              />
            )}

            {showRecruitMessage && mode === "menu" && <RecruitMessage />}

            {showDifficultyModal && (
              <DifficultySelectionModal onSelect={handleDifficultySelect} />
            )}

            {mode === "play" && !playerCountry && !showDifficultyModal && (
              <CountrySelectionModal
                onSelect={handleSelectCountry}
                availableCountries={gameMapData}
              />
            )}

            <InfoPanel hoveredHex={hoveredHex} flagsMap={flagsMap} />

            <UnitHPPanel hoveredHex={hoveredHex} units={units} />

            {gameOver && (
              <GameOverOverlay
                gameResult={gameResult}
                gameOverMessage={gameOverMessage}
                showMenuButton={showMenuButton}
                onReturnToMenu={handleReturnToMenu}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
