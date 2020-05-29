import React, { useLayoutEffect } from "react";
import WorldMapTwo from "./WorldMapTwo";
import { useGetRegrets } from "../hooks/useGetRegrets";
import { snakeCase } from "../lib";
import { colors } from "../styles";

export default function InteractiveMap({ viewBox, mapState, activeState }) {
  const { totalRegretsPerCountry, totalRegretsPerState } = useGetRegrets(
    activeState
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (mapState === "WORLD") {
      document
        .querySelectorAll("[data-state]")
        .forEach((c) => c.style.setProperty("--lightness", 90));
      const countries = Object.entries(totalRegretsPerCountry);
      const highestCountry = getHighestCount(countries);
      const getLightnessForCountry = (count) => (count / highestCountry) * 100;
      countries.forEach(([key, value]) => {
        const id = snakeCase(key);
        const countryEl = document.querySelector(`[data-country="${id}"]`);
        if (!countryEl) return;
        const lightnessForCountry = getLightnessForCountry(value);
        countryEl.style.setProperty(
          "--lightness",
          100 - (lightnessForCountry + 50)
        );
        countryEl.dataset.hasentries = true;
      });
    }
    if (mapState === "PARENT_COUNTRY") {
      document
        .querySelectorAll("[data-country]")
        .forEach((c) => c.style.setProperty("--lightness", 90));
      const states = Object.entries(totalRegretsPerState);
      const highestState = getHighestCount(states);
      const getLightnessForState = (count) => (count / highestState) * 100;
      states.forEach(([key, value]) => {
        const id = snakeCase(key);
        const stateEl = document.querySelector(`[data-state="${id}"]`);
        if (!stateEl) return;
        const lightnessForState = getLightnessForState(value);
        stateEl.style.setProperty(
          "--lightness",
          100 - (lightnessForState + 50)
        );
        stateEl.dataset.hasentries = true;
      });
    }
  }, [mapState]);
  return <WorldMapTwo viewBox={viewBox} />;
}

function getHighestCount(listOfPlaces) {
  return listOfPlaces
    .map((country) => country[1])
    .sort((a, b) => {
      console.log(Number(a));
      return Number(a) >= Number(b) ? -1 : 1;
    })[0];
}
