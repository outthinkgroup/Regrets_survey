import React, { useState, useEffect } from "react";
import { RegretCard } from "../components/StateInfoCard";
import styled from "styled-components";
import { colors, fonts } from "../styles/index.js";

export default function ShareImage() {
  const [regretInfo, setRegretInfo] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const infoFromUrl = getUrlParams();
      setRegretInfo(infoFromUrl);
    }
  }, []);
  if (!regretInfo) return null;
  const { age, gender, regret, country, state } = regretInfo;
  return (
    <ShareImageWrapper className="shareimage-container">
      <div className="regret">
        <RegretCard
          age={age}
          gender={gender}
          regret={regret}
          state={state}
          location={{ country, state }}
          header={""}
          footer={
            <span className="footer-text">
              see more at{" "}
              <span className="red-text">worldregretsurvey.com</span>
            </span>
          }
        />
      </div>
      <div className="title">
        <h1>
          <span>from the</span>
          world regret survey
        </h1>
        <p>by daniel pink</p>
      </div>
    </ShareImageWrapper>
  );
}
const ShareImageWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  background: url("/dsi-bg.png");
  background-repeat: norepeat;
  background-size: cover;
  padding-left: 99px;
  padding-right: 99px;
  & > * {
    width: 100%;
    position: relative;
  }
  .red-text {
    color: ${colors.primary.base};
  }
  ${RegretCard} .active-state-info-card {
    width: 100%;
  }
  .title {
    padding: 20px;
    text-align: center;
    h1 {
      font-size: 59px;
      text-transform: capitalize;
    }
    h1 span {
      display: block;
      font-size: 38px;
      font-weight: 400;
    }
  }
  .title p {
    font-size: 15px;
    font-weight: bold;
    color: ${colors.primary.base};
  }
  .footer-text {
    font-family: ${fonts.family};
    font-weight: bold;
  }
`;
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const age = params.get("age");
  const gender = params.get("gender");
  const state = params.get("state");
  const country = params.get("country");
  const regret = params.get("regret");

  return {
    age,
    gender,
    regret,
    country,
    state,
  };
}
