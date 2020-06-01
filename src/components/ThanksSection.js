import React from "react";

import ShareIcons from "./ShareIcons";
import { PageHeading, PageIntro } from "../styles";
function ThanksSection({ className }) {
  return (
    <PageIntro className={className}>
      <PageHeading>
        Thanks For Taking
        <br />
        The World Regret Survey
      </PageHeading>
      <div>
        <p>check out the map, and feel free to share it!!</p>
        <ShareIcons />
      </div>
    </PageIntro>
  );
}

export default ThanksSection;
