import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export const AboutContent = () => {
  const data = useStaticQuery(graphql`
    query About {
      markdownRemark(frontmatter: { slug: { eq: "about" } }) {
        html
      }
    }
  `);
  return <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />;
};
