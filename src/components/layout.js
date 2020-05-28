import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";

import Header from "./header";
import "./layout.css";

const Layout = ({ children, className }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={className}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          World Regret Survey - A Dan Pink Project
        </footer>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default styled(Layout)`
  background-color: white;
  background-image: linear-gradient(
      180deg,
      #efefef 0%,
      rgba(255, 255, 255, 0) 46.93%
    ),
    url("/Artworkaaa.png");
  background-repeat: no-repeat;
  background-size: 100% 200px, cover;
  min-height: 100vh;
  padding-top: 70px;
`;
