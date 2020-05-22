import React from "react";
import { Link as _Link } from "gatsby";
import styled from "styled-components";
import { fonts, colors } from "../styles";
function SurveyButton({ children, className, to }) {
  return (
    <Button
      as="a"
      className={className}
      href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr"
    >
      {children}
    </Button>
  );
}

export { SurveyButton };

export const Button = styled(_Link)`
  text-decoration: none;
  font-weight: ${fonts.weights[2]};
  background: ${colors.primary.base};
  color: white;
  font-size: ${fonts.sizes.copy};
  padding: 8px 14px;
  line-height: 2em;
  white-space: nowrap;
`;
