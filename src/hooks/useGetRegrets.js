import { useState, useEffect, useCallback } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { snakeCase } from "../lib";

export const GET_REGRETS = graphql`
  query GET_REGRETS {
    allQualtricsData {
      nodes {
        results {
          locations {
            name
            regretCount
          }
          regretList {
            date
            gender
            id
            age
            location {
              country
              state
            }
            regret
          }
          locationCount
          previousLocationCount
          previousRegretCount
          regretCount
        }
      }
    }
  }
`;

export function useGetRegrets(activeState, mapState, regretId = false) {
  const { allQualtricsData } = useStaticQuery(GET_REGRETS);
  const { results } = allQualtricsData.nodes[0];

  const {
    regretList,
    locations,
    locationCount,
    previousLocationCount,
    regretCount,
    previousRegretCount,
  } = results;

  const [activeRegret, setActiveRegret] = useState();

  function getRegretBy() {
    const allInRegion = getRegretsByLocation(activeState);
    if (!regretId) {
      const getRandom =
        allInRegion[Math.floor(Math.random() * allInRegion.length)];
      setActiveRegret(getRandom);
    } else {
      setActiveRegret(allInRegion.find((r) => r.id === regretId));
    }
  }

  function getAnotherRegret() {
    const availableRegrets = getRegretsByLocation(activeState);
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

  function getRegretsByLocation(location) {
    return regretList.filter(function (regret) {
      if (!regret.location) return false;
      const { country, state } = regret.location;
      const countryId = snakeCase(country);
      const stateId = state && snakeCase(state);
      if (mapState === "COUNTRY") {
        return countryId === location;
      }
      if (mapState === "STATE") {
        return stateId === location;
      }
      return false;
    });
  }

  const activeStateHasMultiple = getRegretsByLocation(activeState).length > 1;

  const totalRegretsPerCountry = regretList.reduce((totals, regret) => {
    if (!regret.location) return totals;
    const { country } = regret.location;
    if (!totals[country]) {
      totals[country] = 0;
    }
    totals[country]++;
    return totals;
  }, {});

  const totalRegretsPerStateByCountry = (countryActive) =>
    regretList
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

  const totalRegretsPerState = regretList.reduce((totals, regret) => {
    if (!regret.location) return totals;
    const { state } = regret.location;
    if (!totals[state]) {
      totals[state] = 0;
    }
    totals[state]++;
    return totals;
  }, {});

  const regretCallBack = useCallback(getRegretBy, []);
  useEffect(() => {
    regretCallBack();
  }, [activeState, regretCallBack, regretId]);

  return {
    locations,
    regretList,
    activeRegret,
    activeStateHasMultiple,
    totalRegretsPerCountry,
    totalRegretsPerStateByCountry,
    totalRegretsPerState,
    getAnotherRegret,
    locationCount,
    previousLocationCount,
    regretCount,
    previousRegretCount,
  };
}
