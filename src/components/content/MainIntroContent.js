import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
export const MainIntroduction = () => {
  const data = useStaticQuery(graphql`
    query intro {
      mdx(frontmatter: { slug: { eq: "mainIntroduction" } }) {
        body
      }
    }
  `);
  return <MDXRenderer>{data.mdx.body}</MDXRenderer>;
};
