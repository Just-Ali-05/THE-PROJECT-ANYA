import { useState, useCallback } from "react";
import { hexKey, hexDistance, getNeighbors } from "../utils/hexUtils";

const ALLIES = [
  "United Kingdom",
  "France",
  "USA",
  "Poland",
  "Soviet Union (USSR)",
  "Belgium",
  "Netherlands",
  "Norway",
  "Greece",
  "Luxembourg",
  "Czechoslovakia",
  "Yugoslavia",
  "Estonia",
  "Latvia",
  "Lithuania",
];
const AXIS = [
  "Germany",
  "Italy",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Slovakia",
  "Finland",
  "Austria",
];

export function useGameLogic(initialMapData, difficulty = "normal") {
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [gold, setGold] = useState({});
  const [units, setUnits] = useState({});
  const [turnOrder, setTurnOrder] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [relations, setRelations] = useState({});
  const [pendingAttack, setPendingAttack] = useState(null);
  const [actionsRemaining, setActionsRemaining] = useState(3);
  const [playerCountry, setPlayerCountry] = useState(null);

  const initializeGame = useCallback((mapData, selectedPlayerCountry) => {
    setPlayerCountry(selectedPlayerCountry);
    const countries = [
      ...new Set(mapData.map((h) => h.country).filter((c) => c)),
    ];
    setTurnOrder(countries);
    setTurn(0);
    setRound(1);

    const initialGold = {};
    countries.forEach((c) => (initialGold[c] = 100));
    setGold(initialGold);

    const initialRelations = {};
    countries.forEach((c1) => {
      initialRelations[c1] = {};
      countries.forEach((c2) => {
        if (c1 === c2) return;

        let status = "peace";
        const isC1Allied = ALLIES.includes(c1);
        const isC2Allied = ALLIES.includes(c2);
        const isC1Axis = AXIS.includes(c1);
        const isC2Axis = AXIS.includes(c2);

        if ((isC1Allied && isC2Axis) || (isC1Axis && isC2Allied)) {
          status = "war";
        }
        initialRelations[c1][c2] = status;
      });
    });
    setRelations(initialRelations);

    setUnits({});
    setSelectedUnit(null);
    setActionsRemaining(3);
  }, []);

  const setWar = useCallback((c1, c2) => {
    setRelations((prev) => ({
      ...prev,
      [c1]: { ...prev[c1], [c2]: "war" },
      [c2]: { ...prev[c2], [c1]: "war" },
    }));
  }, []);

  const handleHexClick = useCallback(
    (hex) => {
      if (!playerCountry) return null;
      const key = hexKey(hex.q, hex.r);
      const currentTurnCountry = turnOrder[turn];

      if (currentTurnCountry !== playerCountry) {
        console.log("Not your turn!");
        return null;
      }

      if (actionsRemaining <= 0) {
        console.log("No actions remaining this turn!");
        return null;
      }

      const unitAtHex = units[key];

      if (selectedUnit) {
        const dist = hexDistance(selectedUnit.q, selectedUnit.r, hex.q, hex.r);
        if (dist === 1) {
          if (unitAtHex && unitAtHex.owner !== playerCountry) {
            if (
              pendingAttack &&
              pendingAttack.q === hex.q &&
              pendingAttack.r === hex.r
            ) {
              const relation =
                relations[playerCountry]?.[unitAtHex.owner] || "peace";
              if (relation === "peace") {
                setWar(playerCountry, unitAtHex.owner);
                console.log(
                  `War declared between ${playerCountry} and ${unitAtHex.owner}!`
                );
              }

              setUnits((prev) => {
                const newUnits = { ...prev };
                const targetHp = unitAtHex.hp || 100;
                const newHp = targetHp - 50;

                if (newHp <= 0) {
                  delete newUnits[key];
                  console.log(`Destroyed enemy at ${key}`);
                } else {
                  newUnits[key] = { ...unitAtHex, hp: newHp };
                  console.log(
                    `Attacked enemy at ${key}. HP remaining: ${newHp}`
                  );
                }
                return newUnits;
              });
              setSelectedUnit(null);
              setPendingAttack(null);
              const nextActions = actionsRemaining - 1;
              setActionsRemaining(nextActions);
              return {
                action: "attack",
                q: hex.q,
                r: hex.r,
                autoEnd: nextActions <= 0,
              };
            } else {
              setPendingAttack({ q: hex.q, r: hex.r });
              console.log("Attack targeted. Click again to confirm.");
              return { action: "target", q: hex.q, r: hex.r };
            }
          } else {
            setPendingAttack(null);

            const isFriendlyHex = hex.country === playerCountry;
            const isNeutralEnemyLand =
              hex.country !== playerCountry && hex.terrain !== "sea";

            if (isFriendlyHex && hex.terrain !== "sea") {
              setUnits((prev) => {
                const newUnits = { ...prev };
                const unitData = {
                  ...newUnits[hexKey(selectedUnit.q, selectedUnit.r)],
                };
                delete newUnits[hexKey(selectedUnit.q, selectedUnit.r)];
                newUnits[key] = unitData;
                return newUnits;
              });

              setSelectedUnit(null);
              const nextActions = actionsRemaining - 1;
              setActionsRemaining(nextActions);
              return {
                action: "move",
                q: hex.q,
                r: hex.r,
                autoEnd: nextActions <= 0,
              };
            } else if (isNeutralEnemyLand) {
              const relation =
                relations[playerCountry]?.[hex.country] || "peace";
              if (relation === "peace" && hex.country !== null) {
                setWar(playerCountry, hex.country);
              }

              setUnits((prev) => {
                const newUnits = { ...prev };
                const unitData = {
                  ...newUnits[hexKey(selectedUnit.q, selectedUnit.r)],
                };
                delete newUnits[hexKey(selectedUnit.q, selectedUnit.r)];
                newUnits[key] = unitData;
                return newUnits;
              });

              setSelectedUnit(null);
              const nextActions = actionsRemaining - 1;
              setActionsRemaining(nextActions);
              return {
                action: "capture",
                q: hex.q,
                r: hex.r,
                country: playerCountry,
                autoEnd: nextActions <= 0,
              };
            }
          }
        }
        setSelectedUnit(null);
        setPendingAttack(null);
        return null;
      }

      setPendingAttack(null);
      if (unitAtHex && unitAtHex.owner === playerCountry) {
        setSelectedUnit({ ...unitAtHex, q: hex.q, r: hex.r });
        return { action: "select", q: hex.q, r: hex.r };
      } else if (
        hex.country === playerCountry &&
        !unitAtHex &&
        (hex.terrain === "land" ||
          hex.terrain === "city" ||
          hex.terrain === "capital")
      ) {
        const UNIT_COST = 100;
        const currentGold = gold[playerCountry] || 0;

        if (currentGold >= UNIT_COST) {
          setGold((prev) => ({
            ...prev,
            [playerCountry]: prev[playerCountry] - UNIT_COST,
          }));
          setUnits((prev) => ({
            ...prev,
            [key]: {
              owner: playerCountry,
              hp: 100,
              maxHp: 100,
              type: "infantry",
            },
          }));
          const nextActions = actionsRemaining - 1;
          setActionsRemaining(nextActions);
          return {
            action: "recruit",
            q: hex.q,
            r: hex.r,
            autoEnd: nextActions <= 0,
          };
        }
      }
      return null;
    },
    [
      units,
      selectedUnit,
      turn,
      turnOrder,
      gold,
      relations,
      setWar,
      pendingAttack,
      actionsRemaining,
      playerCountry,
    ]
  );

  const executeAITurn = useCallback(
    (country, mapData) => {
      if (!country || country === "Loading..." || country === playerCountry)
        return [];

      const UNIT_COST = 100;
      const maxActions =
        difficulty === "hard" ? 3 : difficulty === "normal" ? 2 : 1;
      let actionsTaken = 0;
      const updates = [];

      let localUnits = { ...units };
      let localGoldValue = gold[country] || 0;

      const performOneAction = () => {
        if (localGoldValue >= UNIT_COST) {
          const myHexes = mapData.filter(
            (h) =>
              h.country === country &&
              h.terrain !== "sea" &&
              h.terrain !== "mountain"
          );
          const emptyHexes = myHexes.filter(
            (h) => !localUnits[hexKey(h.q, h.r)]
          );

          if (emptyHexes.length > 0) {
            const borderHexes = emptyHexes.filter((h) => {
              return getNeighbors(h.q, h.r).some((n) => {
                const neighborHex = mapData.find(
                  (mh) => mh.q === n.q && mh.r === n.r
                );
                return (
                  neighborHex &&
                  neighborHex.country !== country &&
                  neighborHex.country !== null &&
                  relations[country]?.[neighborHex.country] === "war"
                );
              });
            });

            const targetHex =
              borderHexes.length > 0
                ? borderHexes[Math.floor(Math.random() * borderHexes.length)]
                : emptyHexes[Math.floor(Math.random() * emptyHexes.length)];
            const key = hexKey(targetHex.q, targetHex.r);

            localGoldValue -= UNIT_COST;
            localUnits[key] = { owner: country, hp: 100, maxHp: 100 };
            return true;
          }
        }

        const myUnitKeys = Object.keys(localUnits).filter(
          (k) => localUnits[k].owner === country
        );
        const shuffledUnitKeys = [...myUnitKeys].sort(
          () => Math.random() - 0.5
        );

        for (const key of shuffledUnitKeys) {
          const [q, r] = key.split(",").map(Number);
          const neighbors = getNeighbors(q, r);

          const enemyUnitNeighbor = neighbors.find((n) => {
            const nKey = hexKey(n.q, n.r);
            return (
              localUnits[nKey] &&
              localUnits[nKey].owner !== country &&
              relations[country]?.[localUnits[nKey].owner] === "war"
            );
          });

          if (enemyUnitNeighbor) {
            const nKey = hexKey(enemyUnitNeighbor.q, enemyUnitNeighbor.r);
            const damage = 50;
            const targetUnit = localUnits[nKey];
            if (targetUnit) {
              const newHp = (targetUnit.hp || 100) - damage;
              if (newHp <= 0) {
                delete localUnits[nKey];
              } else {
                localUnits[nKey] = { ...targetUnit, hp: newHp };
              }
            }
            return true;
          }

          const enemyLandNeighbor = neighbors.find((n) => {
            const nHex = mapData.find((mh) => mh.q === n.q && mh.r === n.r);
            if (!nHex) return false;
            if (nHex.terrain === "sea" || nHex.terrain === "mountain")
              return false;

            return (
              nHex.country !== country &&
              nHex.country !== null &&
              !localUnits[hexKey(n.q, n.r)] &&
              relations[country]?.[nHex.country] === "war"
            );
          });

          if (enemyLandNeighbor) {
            const nKey = hexKey(enemyLandNeighbor.q, enemyLandNeighbor.r);
            const unitData = localUnits[key];
            delete localUnits[key];
            localUnits[nKey] = unitData;
            updates.push({
              action: "capture",
              q: enemyLandNeighbor.q,
              r: enemyLandNeighbor.r,
              country,
            });
            return true;
          }
        }

        return false;
      };

      while (actionsTaken < maxActions) {
        if (performOneAction()) {
          actionsTaken++;
        } else {
          break;
        }
      }

      setUnits(localUnits);
      setGold((prev) => ({ ...prev, [country]: localGoldValue }));

      return updates;
    },
    [gold, units, relations, difficulty, playerCountry]
  );

  const endTurn = useCallback(
    (mapData) => {
      if (turnOrder.length === 0) return;

      const nextIndex = (turn + 1) % turnOrder.length;
      const nextCountry = turnOrder[nextIndex];

      if (nextIndex === 0) {
        setRound((r) => r + 1);
      }

      const hexCount = mapData.filter((h) => h.country === nextCountry).length;
      const income = hexCount * 10;

      setGold((prev) => ({
        ...prev,
        [nextCountry]: (prev[nextCountry] || 0) + income,
      }));

      setTurn(nextIndex);
      setSelectedUnit(null);
      setActionsRemaining(3);
    },
    [turn, turnOrder]
  );

  return {
    turn,
    round,
    gold,
    units,
    turnOrder,
    selectedUnit,
    relations,
    initializeGame,
    handleHexClick,
    nextTurn: endTurn,
    executeAITurn,
    pendingAttack,
    actionsRemaining,
    playerCountry,
    setPlayerCountry,
  };
}
