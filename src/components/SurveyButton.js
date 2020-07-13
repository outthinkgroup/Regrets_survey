import React from "react";
import { Link as _Link } from "gatsby";
import styled from "styled-components";
import { fonts, colors } from "../styles";
import { trackCustomEvent } from "gatsby-plugin-google-analytics";
function SurveyButton({ children, className, size, includeOtherLang }) {
  return (
    <>
      <Button
        as="a"
        size={size}
        className={className}
        onClick={() =>
          trackCustomEvent({
            category: "general",
            action: "clicked take survey",
            label: size === "large" ? "button in copy" : "button in header",
          })
        }
        href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr"
      >
        Take Survey
      </Button>
      <p style={{ fontSize: ".75em", marginTop: ".5em" }}>
        take survey in:{" "}
        <a href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr/?lang=en">
          español
        </a>{" "}
        |{" "}
        <a href="https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr/?lang=">
          普通话
        </a>
      </p>
    </>
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
