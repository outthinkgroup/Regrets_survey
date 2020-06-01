import React from "react";
import styled from "styled-components";

import AuthorImage from "./AuthorImage";
import { AboutContent } from "./content";
function About({ className }) {
  return (
    <div className={className}>
      <AuthorImage />
      <h2>About the Author</h2>
      <AboutContent />
    </div>
  );
}
export default styled(About)`
  text-align: center;
  h2 {
    margin: 20px;
  }
`;
