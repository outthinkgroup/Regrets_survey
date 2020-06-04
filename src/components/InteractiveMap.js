import React, { useLayoutEffect, useEffect } from "react";
import WorldMapTwo from "./WorldMapTwo";
import { useGetRegrets } from "../hooks/useGetRegrets";
import { snakeCase } from "../lib";
import { colors } from "../styles";

export default function InteractiveMap({
  viewBox,
  mapState,
  activeState,
  onClick,
}) {
  const {
    totalRegretsPerCountry,
    totalRegretsPerState,
    totalRegretsPerStateByCountry,
  } = useGetRegrets(activeState);

  //COLORS THE STATES/COUNTRIES BASED ON REGRETS
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (mapState === "WORLD") {
      document
        .querySelectorAll("[data-state]")
        .forEach((c) => c.style.setProperty("--lightness", 90));
      const countries = Object.entries(totalRegretsPerCountry);
      const highestCountry = getHighestCount(countries);
      const getLightnessForCountry = (count) =>
        (count / highestCountry) * 100 + 30;
      countries.forEach(([key, value]) => {
        const id = snakeCase(key);
        const countryEl = document.querySelector(`[data-country="${id}"]`);
        if (!countryEl) return;
        const lightnessForCountry = getLightnessForCountry(value);
        countryEl.style.setProperty("--lightness", 100 - lightnessForCountry);
      });
    }
    if (mapState === "PARENT_COUNTRY" || mapState === "STATE") {
      document
        .querySelectorAll("[data-country]")
        .forEach((c) => c.style.setProperty("--lightness", 90));

      const stateCountry =
        mapState === "STATE"
          ? document
              .querySelector(`[data-state="${activeState}"]`)
              .closest("[data-country]").dataset.country
          : activeState;

      const states = Object.entries(
        totalRegretsPerStateByCountry(stateCountry)
      );

      const highestState = getHighestCount(states);
      const getLightnessForState = (count) => (count / highestState) * 100 + 30;
      states.forEach(([key, value]) => {
        const id = snakeCase(key);
        const stateEl = document.querySelector(`[data-state="${id}"]`);
        if (!stateEl) return;
        const lightnessForState = getLightnessForState(value);
        stateEl.style.setProperty("--lightness", 110 - lightnessForState);
      });
    }
  }, [mapState]);

  //THIS TELLS THE DOM IF THE COUNTRY/STATE HAS REGRETS
  useLayoutEffect(() => {
    const states = Object.entries(totalRegretsPerState);

    states.forEach(([key, value]) => {
      const id = snakeCase(key);

      const stateEl = document.querySelector(`[data-state="${id}"]`);
      if (!stateEl) return;
      stateEl.dataset.hasentries = true;
    });

    const countries = Object.entries(totalRegretsPerCountry);
    countries.forEach(([key, value]) => {
      const id = snakeCase(key);
      const countryEl = document.querySelector(`[data-country="${id}"]`);
      if (!countryEl) return;
      countryEl.dataset.hasentries = true;
    });
  }, []);

  return <WorldMapTwo onClick={onClick} viewBox={viewBox} />;
}

function getHighestCount(listOfPlaces) {
  return listOfPlaces
    .map((country) => country[1])
    .sort((a, b) => {
      return Number(a) >= Number(b) ? -1 : 1;
    })[0];
}
