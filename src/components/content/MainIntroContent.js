import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export const MainIntroduction = () => {
  const data = useStaticQuery(graphql`
    query intro {
      markdownRemark(frontmatter: { slug: { eq: "mainIntroduction" } }) {
        html
      }
    }
  `);
  return <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />;
};
