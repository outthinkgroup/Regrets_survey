import React from "react";
import styled from "styled-components";
import { SurveyButton } from "./SurveyButton";
import { PageHeading, PageIntro } from "../styles";
function Welcome({ className }) {
  return (
    <PageIntro className={className}>
      <PageHeading>
        Welcome To the
        <br /> World Regret Survey
      </PageHeading>
      <p>
        Eu sem conubia tincidunt, maecenas netus fusce, natoque ipsum. Duis
        lacus eleifend venenatis a adipiscing ipsum condimentum, iaculis
        himenaeos suspendisse varius semper efficitur facilisi aenean, hac
        consequat dictum volutpat augue non. Iaculis ridiculus dignissim cubilia
        magna nec scelerisque tortor, parturient tristique commodo inceptos et
        ex, dolor aliquam venenatis duis vehicula donec.
      </p>
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
