import { Link } from "gatsby";
import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import Menu from "./Menu";
import { layout, fonts, breakpoints } from "../styles";

const Header = ({ siteTitle, className }) => (
  <header className={className} style={{}}>
    <div className="container">
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <Menu />
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default styled(Header)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  margin-bottom: 1.45rem;
  .container {
    margin: 0 auto;
    max-width: ${layout.maxWidth};
    padding: 1.45rem 1.0875rem;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  h1 {
    margin: 0;
    display: flex;
    align-items: center;
    a {
      font-size: ${fonts.sizes.heading[2]};
      @media (max-width: ${breakpoints.small}) {
        font-size: ${fonts.sizes.heading[1]};
      }
      color: black;
      text-decoration: none;
    }
  }
`;
