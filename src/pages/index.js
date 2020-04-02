import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RegretsMap from "../components/RegretsMap"
import WelcomeSection from "../components/Welcome"
const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <WelcomeSection />
    <RegretsMap />
  </Layout>
)

export default IndexPage
