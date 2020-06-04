import React from "react";
import styled from "styled-components";
import { SurveyButton } from "./SurveyButton";
import { PageHeading, PageIntro } from "../styles";
import { MainIntroduction } from "./content";
function Welcome({ className }) {
  return (
    <PageIntro className={className}>
      <PageHeading>
        <span style={{ fontSize: `.75em` }}>Welcome To the</span>
        <br /> <span style={{ fontWeight: 900 }}>World Regret Survey</span>
      </PageHeading>
      <MainIntroduction />
    </PageIntro>
  );
}

export default styled(Welcome)`
  p {
    line-height: 1.5;
    font-size: 22px;
  }
`;
