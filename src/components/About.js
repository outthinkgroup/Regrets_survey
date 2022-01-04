import React from "react";
import styled from "styled-components";

import AuthorImage from "./AuthorImage";
import { AboutContent } from "./content";
import { breakpoints } from "../styles";
import { Container } from "./layout";
function About({ className }) {
  return (
    <Container className={className}>
      <div className={className}>
        <AuthorImage />
        <div className="content">
          <AboutContent />
        </div>
      </div>
    </Container>
  );
}
export default styled(About)`
  max-width: 900px;
  margin: 0 auto;
  @media (min-width: ${breakpoints.small}) {
    display: flex;
    align-items: center;
    .content {
      margin-left: 50px;
      p {
        margin-bottom: 0;
      }
    }
  }
  .author-image {
    min-width: 125px;
  }
`;
