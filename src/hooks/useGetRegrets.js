import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { snakeCase } from "../lib";
const GET_REGRETS = graphql`
  query GET_REGRETS {
    allQualtricsData {
      regrets: nodes {
        regret
        location {
          country
          state
        }
      }
    }
  }
`;
export function useGetRegrets(activeState, mapState) {
  const { allQualtricsData } = useStaticQuery(GET_REGRETS);
  const { regrets } = allQualtricsData;
  const [activeRegret, setActiveRegret] = useState();

  function getRegretBy() {
    const allInRegion = regrets.filter((regret) => {
      const { country, state } = regret.location;
      const countryId = snakeCase(country);
      const stateId = snakeCase(state);
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

  const totalRegretsPerCountry = regrets.reduce((totals, regret) => {
    const { country } = regret.location;
    if (!totals[country]) {
      totals[country] = 0;
    }
    totals[country]++;
    return totals;
  }, {});
  const totalRegretsPerState = regrets
    .filter((regret) => {
      const { country } = regret.location;
      const countryId = snakeCase(country);
      return countryId === activeState;
    })
    .reduce((totals, regret) => {
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
    totalRegretsPerCountry,
    totalRegretsPerState,
    getRegretBy,
  };
}
