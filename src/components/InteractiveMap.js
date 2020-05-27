import React, { useEffect } from "react";
import WorldMapTwo from "./WorldMapTwo";
import { useGetRegrets } from "../hooks/useGetRegrets";
import { snakeCase } from "../lib";
import { colors } from "../styles";
const state = "country";
export default function InteractiveMap({ viewBox }) {
  const { totalRegretsPerCountry } = useGetRegrets();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const countries = Object.entries(totalRegretsPerCountry);

    const highest = getHighestCount(countries);
    const getLightness = (count) => (count / highest) * 100;
    countries.forEach(([key, value]) => {
      const id = snakeCase(key);
      const countryEl = document.querySelector(
        `[data-country="${id}"], [data-state=${id}]`
      );

      if (!countryEl) return;
      const lightness = getLightness(value);
      countryEl.style.setProperty("--lightness", 100 - (lightness + 50));
      countryEl.dataset.hasentries = true;
    });
  }, [viewBox]);
  return <WorldMapTwo viewBox={viewBox} />;
}
function getAverageCount(countries) {
  const total = countries.reduce(
    (total, [key, value]) => total + Number(value),
    0
  );
  console.log(total);
  return total / countries.length;
}

function getHighestCount(countries) {
  return countries
    .map((country) => country[1])
    .sort((a, b) => {
      console.log(Number(a));
      return Number(a) >= Number(b) ? -1 : 1;
    })[0];
}
