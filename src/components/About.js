import React from "react";
import styled from "styled-components";

import AuthorImage from "./AuthorImage";
import { AboutContent } from "./content";
import { breakpoints } from "../styles";
function About({ className }) {
  return (
    <div className={className}>
      <AuthorImage />
      <div className="content">
        <h2>About the Author</h2>
        <AboutContent />
      </div>
    </div>
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
