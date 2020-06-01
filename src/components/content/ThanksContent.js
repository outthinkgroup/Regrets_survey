import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export const ThanksContent = () => {
  const data = useStaticQuery(graphql`
    query thanks {
      markdownRemark(frontmatter: { slug: { eq: "thanks" } }) {
        html
      }
    }
  `);
  return <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />;
};
