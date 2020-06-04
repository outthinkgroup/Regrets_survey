import React from "react";
import { Link as _Link } from "gatsby";
import styled from "styled-components";
import { fonts, colors } from "../styles";
function SurveyButton({ children, className, size }) {
  return (
    <Button
      as="a"
      size={size}
      className={className}
      href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr"
    >
      Take Survey
    </Button>
  );
}

export { SurveyButton };

export const Button = styled(_Link)`
  text-decoration: none;
  font-weight: ${fonts.weights[2]};
  background: ${colors.primary.base};
  color: white;
  font-size: ${({ size }) => (size === `large` ? `22px` : fonts.sizes.copy)};
  padding: 0.55em 1em;
  line-height: 2em;
  white-space: nowrap;
`;
