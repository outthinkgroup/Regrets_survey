import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import RegretsMap from "../components/RegretsMap";
import WelcomeSection from "../components/Welcome";
import About from "../components/About";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <WelcomeSection />
    <RegretsMap />
    <About />
  </Layout>
);

export default IndexPage;
