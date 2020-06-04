import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
export const AboutContent = () => {
  const data = useStaticQuery(graphql`
    query about {
      mdx(frontmatter: { slug: { eq: "about" } }) {
        body
      }
    }
  `);
  return <MDXRenderer>{data.mdx.body}</MDXRenderer>;
};
