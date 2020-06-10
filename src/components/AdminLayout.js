import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import { fonts } from "../styles";
import AdminHeader from "./AdminHeader";

import "./layout.css";

const AdminLayout = ({ children, className }) => {
  const data = useStaticQuery(graphql`
    query AdminSiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={className}>
      <AdminHeader siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem`,
        }}
      >
        <main>{children}</main>
        <footer>
          <div>
            © {new Date().getFullYear()},{" "}
            <a href="https://danpink.com/about/">Daniel Pink</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default styled(AdminLayout)`
  main {
    min-height: 80vh;
    padding-top: 30px;
  }
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
