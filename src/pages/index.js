import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import RegretsMap from "../components/RegretsMap";
import WelcomeSection from "../components/Welcome";
import About from "../components/About";
import BookPromoSecction from "../components/BookPromo";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <WelcomeSection />
    <BookPromoSecction />
    <RegretsMap />
    <About />
  </Layout>
);

export default IndexPage;
