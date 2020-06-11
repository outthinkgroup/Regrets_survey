import React from "react";

import SubscribeSidebar from "./SubscribeSidebar";
import { PageHeading, PageIntro, breakpoints } from "../styles";
import { ThanksContent } from "./content";
import styled from "styled-components";
function ThanksSection({ className }) {
  return (
    <PageIntro className={className}>
      <div>
        <PageHeading style={{ lineHeight: `.75em` }}>
          <span style={{ fontWeight: 900 }}>Thank you</span>
          <br />
          <span style={{ fontSize: `.5em`, lineHeight: `1` }}>
            for completing the World Regret Survey
          </span>
        </PageHeading>
        <div className="content">
          <div className="thanks-content__wrapper">
            <ThanksContent />
          </div>
          <div className="sidebar__wrapper">
            <SubscribeSidebar />
          </div>
        </div>
      </div>
    </PageIntro>
  );
}

export default styled(ThanksSection)`
  .content {
    .sidebar__wrapper {
      margin-top: 40px;
    }
    @media (min-width: ${breakpoints.small}) {
      display: flex;
      justify-content: space-between;
      > div {
        width: 100%;
      }
      .sidebar__wrapper {
        margin-left: 50px;
        max-width: 350px;
        margin-top: 0;
      }
    }
  }
`;
