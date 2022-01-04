import React from "react";
import styled from "styled-components";
import { PageHeading, PageIntro, breakpoints } from "../styles";
import { MainIntroduction } from "./content";
import { Container } from "./layout";

function Welcome({ className }) {
  return (
    <Container>
      <PageIntro className={className}>
        <PageHeading>
          <span style={{ fontSize: `.75em` }}>Welcome to the</span>
          <br /> <span style={{ fontWeight: 900 }}>World Regret Survey</span>
        </PageHeading>
        <MainIntroduction />
      </PageIntro>
    </Container>
  );
}

export default styled(Welcome)`
  margin-bottom: 75px;
  @media (min-width: ${breakpoints.small}) {
    margin-bottom: 75px;
  }
  p {
    line-height: 1.5;
    font-size: 22px;
  }
`;
