import React from "react";
import { useStaticQuery, graphql } from "gatsby";

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
export function useGetRegrets() {
  const { allQualtricsData } = useStaticQuery(GET_REGRETS);
  const { regrets } = allQualtricsData;

  return { regrets };
}
