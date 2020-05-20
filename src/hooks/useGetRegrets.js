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
export function useGetRegrets(activeState) {
  const { allQualtricsData } = useStaticQuery(GET_REGRETS);
  const { regrets } = allQualtricsData;
  const [activeRegret, setActiveRegret] = useState();

  function getRegretBy(type = "country") {
    console.log("ran");
    const allInRegion = regrets.filter((regret) => {
      const { country } = regret.location;
      const countryId = snakeCase(country);

      return countryId == activeState;
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

  useEffect(() => {
    getRegretBy();
  }, [activeState]);

  return { regrets, activeRegret, totalRegretsPerCountry, getRegretBy };
}
