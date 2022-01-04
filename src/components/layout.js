import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import { fonts, colors } from "../styles";
import Header from "./header";
import "./layout.css";
import Notifications from "./Notifications";

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
      <main>{children}</main>
      <footer style={{ "--primary": colors.primary.base }}>
        <div>
          © {new Date().getFullYear()},{" "}
          <a href="https://danpink.com/about/">Daniel Pink</a> - site by{" "}
          <a href="https://outthinkgroup.com/">Out:think</a>
        </div>
      </footer>
      <Notifications />
    </div>
  );
};

export const Container = ({ children, styles }) => (
  <div
    style={{
      margin: `0 auto`,
      maxWidth: 960,
      padding: `0 1.0875rem`,
      "--primary": colors.primary.base,
      ...styles,
    }}
  >
    {children}
  </div>
);

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
  footer {
    text-align: center;
    font-family: ${fonts.family};
    padding: 60px 0px 20px;
    font-size: 14px;
  }
`;
