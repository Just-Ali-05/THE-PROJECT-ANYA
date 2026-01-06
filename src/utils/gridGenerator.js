export function generateRectangularGrid(width, height) {
  const hexes = [];

  for (let r = 0; r < height; r++) {
    const r_offset = Math.floor(r / 2);
    for (let q = -r_offset; q < width - r_offset; q++) {
      hexes.push({
        q: q,
        r: r,
        terrain: "sea",
        country: "",
        countryColor: null,
      });
    }
  }
  return hexes;
}

export function generateEditorGrid() {
  return generateRectangularGrid(40, 40);
}
