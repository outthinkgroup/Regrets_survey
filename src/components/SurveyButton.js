import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { fonts, colors } from "../styles"
function SurveyButton({ children, className, to }) {
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  )
}

export default styled(SurveyButton)`
  text-decoration: none;
  font-weight: ${fonts.weights[3]};
  background: ${colors.primary.base};
  color: white;
  font-size: ${fonts.sizes.copy};
  padding: 8px 14px;
`
