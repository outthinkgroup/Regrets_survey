import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SurveyPage = () => (
  <Layout>
    <SEO title="Survey" />
    <h1>Fill out the survey</h1>
    <iframe
      src="https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_6m4U8wCI0lh3VUp"
      width="600px"
      height="800px"
    />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SurveyPage
