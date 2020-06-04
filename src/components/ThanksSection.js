import React from "react";

import ShareIcons from "./ShareIcons";
import { PageHeading, PageIntro } from "../styles";
import { ThanksContent } from "./content";
function ThanksSection({ className }) {
  return (
    <PageIntro className={className}>
      <div>
        <PageHeading style={{ lineHeight: `.75em` }}>
          <span style={{ fontWeight: 900 }}>Thank you</span>
          <br />
          <span style={{ fontSize: `.5em`, lineHeight: `1` }}>
            {" "}
            for completing the World Regret Survey
          </span>
        </PageHeading>
        <ThanksContent />
      </div>
    </PageIntro>
  );
}

export default ThanksSection;
