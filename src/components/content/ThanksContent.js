import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import styled from "styled-components";
import { fonts } from "../../styles";
export const ThanksContent = () => {
  const data = useStaticQuery(graphql`
    query thanks {
      mdx(frontmatter: { slug: { eq: "thanks" } }) {
        body
      }
    }
  `);
  return (
    <ContentStyleWrapper>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </ContentStyleWrapper>
  );
};

const ContentStyleWrapper = styled.div`
  li {
    font-family: ${fonts.family};
    margin-bottom: 40px;
    font-size: 20px;
  }
`;
