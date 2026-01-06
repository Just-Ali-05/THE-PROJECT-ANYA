import { generateRectangularGrid } from "./gridGenerator";
import { europeMapData } from "../data/europeMap";
import COUNTRIES from "../data/countries";

const COUNTRY_MAPPING = {
  "United Kingdom": "uk",
  Ireland: "ireland",
  France: "france",
  Spain: "spain",
  Portugal: "portugal",
  Germany: "germany",
  Netherlands: "netherlands",
  Belgium: "belgium",
  Poland: "poland",
  Norway: "norway",
  Sweden: "sweden",
  Denmark: "denmark",
  Finland: "finland",
  Italy: "italy",
  Switzerland: "switzerland",
  Austria: "germany",
  Czechoslovakia: "czechoslovakia",
  Hungary: "hungary",
  Yugoslavia: "yugoslavia",
  Romania: "romania",
  Albania: "italy",
  Greece: "greece",
  Bulgaria: "bulgaria",
  "Soviet Union (USSR)": "ussr",
  Turkey: "turkey",
  USA: "usa",
};

const TERRAIN_MAPPING = {
  sea: "sea",
  mountain: "mountain",
  plains: "land",
  forest: "land",
  city: "land",
  capital: "land",
};

export function getHydratedEuropeGrid() {
  const grid = generateRectangularGrid(40, 40);

  const Q_OFFSET = 15;
  const R_OFFSET = 15;

  europeMapData.forEach((hex) => {
    const targetQ = hex.q + Q_OFFSET;
    const targetR = hex.r + R_OFFSET;

    const gridHexIndex = grid.findIndex(
      (h) => h.q === targetQ && h.r === targetR
    );

    if (gridHexIndex !== -1) {
      const mappedTerrain = TERRAIN_MAPPING[hex.terrain] || "land";

      let countryId = "";
      if (hex.country) {
        const mappedId = COUNTRY_MAPPING[hex.country];

        if (mappedId) {
          countryId = mappedId;
        } else {
          const directCountry = (COUNTRIES || []).find(
            (c) => c.name === hex.country
          );
          if (directCountry) {
            countryId = directCountry.id;
          } else {
            countryId = "bi";
          }
        }
      }

      let countryColor = null;
      let countryName = "";

      if (countryId && COUNTRIES) {
        const cData = COUNTRIES.find((c) => c.id === countryId);
        if (cData) {
          countryColor = cData.color;
          countryName = cData.name;
        }
      }

      grid[gridHexIndex] = {
        ...grid[gridHexIndex],
        terrain: mappedTerrain,
        country: countryName,
        countryColor: countryColor,
      };
    }
  });

  return grid;
}
