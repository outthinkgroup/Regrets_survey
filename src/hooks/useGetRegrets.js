import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { snakeCase, approvedStates } from "../lib";
import { decode } from "base-64";
const utf8 = require("utf8");
const GET_REGRETS = graphql`
  query GET_REGRETS {
    allQualtricsData {
      nodes {
        results
      }
    }
  }
`;
export function useGetRegrets(activeState, mapState) {
  const { allQualtricsData } = useStaticQuery(GET_REGRETS);
  const { results } = allQualtricsData.nodes[0];

  const regrets = JSON.parse(results);
  const countriesAndStates = Object.keys(regrets);
  const allRegrets = countriesAndStates.reduce((allRegrets, country) => {
    return [...allRegrets, ...regrets[country]];
  }, []);

  const [activeRegret, setActiveRegret] = useState();

  function getRegretBy() {
    const allInRegion = allRegrets.filter((regret) => {
      if (!regret.location) return false;
      const { country, state } = regret.location;
      const countryId = snakeCase(country);
      const stateId = state && snakeCase(state);
      if (mapState === "COUNTRY") {
        return countryId === activeState;
      }
      if (mapState === "STATE") {
        return stateId === activeState;
      }
    });
    const getRandom =
      allInRegion[Math.floor(Math.random() * allInRegion.length)];
    setActiveRegret(getRandom);
  }
  function getAnotherRegret() {
    const availableRegrets = regrets[activeState];
    const currentRegretIndex = availableRegrets.findIndex(
      (regret) => regret.id === activeRegret.id
    );
    const nextRegretIndex = currentRegretIndex + 1;
    if (nextRegretIndex > availableRegrets.length - 1) {
      setActiveRegret(availableRegrets[0]);
    } else {
      setActiveRegret(availableRegrets[nextRegretIndex]);
    }
  }

  const activeStateHasMultiple =
    activeState && regrets[activeState]?.length > 1;

  const totalRegretsPerCountry = allRegrets.reduce((totals, regret) => {
    if (!regret.location) return totals;
    const { country } = regret.location;
    if (!totals[country]) {
      totals[country] = 0;
    }
    totals[country]++;
    return totals;
  }, {});
  const totalRegretsPerStateByCountry = (countryActive) =>
    allRegrets
      .filter((regret) => {
        if (!regret.location) return false;
        const { country } = regret.location;
        const countryId = snakeCase(country);
        return countryId === countryActive;
      })
      .reduce((totals, regret) => {
        const { state } = regret.location;
        if (!totals[state]) {
          totals[state] = 0;
        }
        totals[state]++;
        return totals;
      }, {});
  const totalRegretsPerState = allRegrets.reduce((totals, regret) => {
    if (!regret.location) return totals;
    const { state } = regret.location;
    if (!totals[state]) {
      totals[state] = 0;
    }
    totals[state]++;
    return totals;
  }, {});

  useEffect(() => {
    getRegretBy();
  }, [activeState]);

  return {
    regrets,
    activeRegret,
    activeStateHasMultiple,
    totalRegretsPerCountry,
    totalRegretsPerStateByCountry,
    totalRegretsPerState,
    getAnotherRegret,
  };
}
