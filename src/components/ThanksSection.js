import React from "react";

import ShareIcons from "./ShareIcons";
import { PageHeading, PageIntro } from "../styles";
import { ThanksContent } from "./content";
function ThanksSection({ className }) {
  return (
    <PageIntro className={className}>
      <PageHeading>
        Thanks For Taking
        <br />
        The World Regret Survey
      </PageHeading>
      <div>
        <ThanksContent />
        <ShareIcons />
      </div>
    </PageIntro>
  );
}

export default ThanksSection;
