import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import RegretsMap from "../components/RegretsMap";
import ThanksSection from "../components/ThanksSection";
import About from "../components/About";
const ThanksPage = () => (
  <Layout>
    <SEO title="Thank You" />
    <ThanksSection />
    <RegretsMap />
    <p>[TODO: share component]</p>
  </Layout>
);

export default ThanksPage;
