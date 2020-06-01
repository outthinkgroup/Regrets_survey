import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import RegretsMap from "../components/RegretsMap";
import ThanksSection from "../components/ThanksSection";
import About from "../components/About";
import ShareIcons from "../components/ShareIcons";
const ThanksPage = () => (
  <Layout>
    <SEO title="Thank You" />
    <ThanksSection />
    <RegretsMap />
    <div style={{ textAlign: `center`, marginBottom: `30px` }}>
      <ShareIcons />
    </div>
  </Layout>
);

export default ThanksPage;
