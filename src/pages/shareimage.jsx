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
      <div className="regret-card">
        <blockquote className="regret">{regret}</blockquote>
        <cite>
          <p>
            <span className="gender">{gender}</span>, age{` `}
            <span className="age">{age}</span>
          </p>
          <p>
            {state ? <span className="state">{state}</span> : null},{" "}
            <span className="country">{country}</span>
          </p>
        </cite>
      </div>

      {/* <div className="title">
        <h1>
          <span>from the</span>
          World Regret
          <br />
          Survey
        </h1>
        <p>A project by Daniel Pink</p>
      </div> */}
    </ShareImageWrapper>
  );
}
const ShareImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("/dsi-bg.png");
  background-repeat: norepeat;
  background-size: cover;
  padding-left: 99px;
  padding-right: 89px;
  & > * {
    width: 100%;
    position: relative;
  }
  .red-text {
    color: ${colors.primary.base};
  }
  .regret-card {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    blockquote {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10vh;
      line-height: 1.2;
    }
    cite {
      font-size: 6vh;
      color: ${colors.grey[4]};
      margin-bottom: 1em;
      font-weight: bold;
      p {
        margin-bottom: 0;
      }
      span {
        color: black;
      }
    }
  }
  .title {
    text-shadow: 2px 2px 8px rgb(0 0 0 / 50%);
    padding: 0px;
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
    text-shadow: none;
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
    regret: decodeURIComponent(regret),
    country,
    state,
  };
}
