import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RegretsMap from "../components/RegretsMap"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <RegretsMap />
  </Layout>
)

export default IndexPage
