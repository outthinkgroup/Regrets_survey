import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
export const SubscribeSidebarContent = () => {
  const data = useStaticQuery(graphql`
    query SubscribeSidebar {
      mdx(frontmatter: { slug: { eq: "subscribeSidebar" } }) {
        body
      }
    }
  `);
  return <MDXRenderer>{data.mdx.body}</MDXRenderer>;
};
