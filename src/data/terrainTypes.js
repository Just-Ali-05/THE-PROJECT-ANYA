export const TERRAIN = {
  SEA: {
    id: "sea",
    color: "#1a4b77",
    borderColor: "#0d2840",
    passable: false,
    name: "Sea",
    description: "Impassable Water",
  },
  MOUNTAIN: {
    id: "mountain",
    color: "#6b5b47",
    borderColor: "#3d3428",
    passable: false,
    name: "Mountain",
    description: "Impassable Mountains",
  },
  LAND: {
    id: "land",
    color: "#8fbc8f",
    borderColor: "#5a8a5a",
    passable: true,
    name: "Land",
    description: "Land Mass",
  },
};

export function getTerrainById(id) {
  return Object.values(TERRAIN).find((t) => t.id === id) || TERRAIN.LAND;
}

export function isPassable(terrainId) {
  const terrain = getTerrainById(terrainId);
  return terrain.passable;
}
