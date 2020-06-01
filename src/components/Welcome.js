import React from "react";
import styled from "styled-components";
import { SurveyButton } from "./SurveyButton";
import { PageHeading, PageIntro } from "../styles";
import { MainIntroduction } from "./content";
function Welcome({ className }) {
  return (
    <PageIntro className={className}>
      <PageHeading>
        Welcome To the
        <br /> World Regret Survey
      </PageHeading>
      <MainIntroduction />
      <SurveyButton>Take Survey</SurveyButton>
    </PageIntro>
  );
}

export default styled(Welcome)`
  h1 {
    font-size: 38px;
    @media (min-width: 560px) {
      font-size: 51px;
    }
  }
  margin: 0 auto;
  max-width: 600px;
  padding-top: 100px;
  text-align: center;
  p {
    line-height: 1.5;
  }
  ${SurveyButton} {
    padding: 10px 18px;
    font-size: 18px;
  }
`;
