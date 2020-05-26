import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import RegretsMap from "../components/RegretsMap";
import WelcomeSection from "../components/Welcome";
import About from "../components/About";
const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <WelcomeSection />
    {typeof window !== "undefined" && <RegretsMap />}
    <About />
  </Layout>
);

export default IndexPage;
