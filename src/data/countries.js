export const COUNTRIES = [
  { id: "uk", name: "United Kingdom", color: "#ffb6b6" },
  { id: "france", name: "France", color: "#5b85c1" },
  { id: "usa", name: "USA", color: "#276fbf" },
  { id: "poland", name: "Poland", color: "#db8282" },
  { id: "belgium", name: "Belgium", color: "#e5c05c" },
  { id: "netherlands", name: "Netherlands", color: "#ffad5c" },
  { id: "norway", name: "Norway", color: "#8ca1c4" },
  { id: "denmark", name: "Denmark", color: "#b57a7a" },
  { id: "luxembourg", name: "Luxembourg", color: "#9bc8e5" },
  { id: "greece", name: "Greece", color: "#d0e3f2" },
  { id: "czechoslovakia", name: "Czechoslovakia", color: "#8a6e4b" },
  { id: "yugoslavia", name: "Yugoslavia", color: "#976eab" },

  { id: "germany", name: "Germany", color: "#595959" },
  { id: "italy", name: "Italy", color: "#5ea35e" },
  { id: "hungary", name: "Hungary", color: "#c4b087" },
  { id: "romania", name: "Romania", color: "#b5b56e" },
  { id: "bulgaria", name: "Bulgaria", color: "#7a967a" },
  { id: "slovakia", name: "Slovakia", color: "#bd8ba5" },
  { id: "finland", name: "Finland", color: "#c2d6ed" },
  { id: "estonia", name: "Estonia", color: "#88b5dc" },
  { id: "latvia", name: "Latvia", color: "#9d5b5b" },
  { id: "lithuania", name: "Lithuania", color: "#c4c442" },
  { id: "austria", name: "Austria", color: "#b55a5a" },

  { id: "spain", name: "Spain", color: "#d4aa00" },
  { id: "portugal", name: "Portugal", color: "#008040" },
  { id: "sweden", name: "Sweden", color: "#5c9ea0" },
  { id: "switzerland", name: "Switzerland", color: "#a0a0a0" },
  { id: "turkey", name: "Turkey", color: "#d95030" },
  { id: "ireland", name: "Ireland", color: "#00a86b" },
  { id: "bi", name: "Neutral", color: "#d3d3d3" },

  { id: "ussr", name: "Soviet Union (USSR)", color: "#a63333" },
];

export default COUNTRIES;

export function getCountryById(id) {
  return COUNTRIES.find((c) => c.id === id);
}
