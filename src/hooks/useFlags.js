import { useState, useEffect } from "react";

export function useFlags() {
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
          Estonia: "Estonia",
          Latvia: "Latvia",
          Lithuania: "Lithuania",
          Austria: "Austria",
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

  return flagsMap;
}
