import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import SurveyButton from "./SurveyButton"
function Menu({ className }) {
  return (
    <ul className={className}>
      <li>
        <SurveyButton to="/survey">Take Survey</SurveyButton>
      </li>
    </ul>
  )
}
export default styled(Menu)`
  display: flex;
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    margin-right: 20px;
    margin-bottom: 0;
  }
`
