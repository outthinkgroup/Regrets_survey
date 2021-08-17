import React from "react";
import Layout from "../components/layout";
import RegretsMap from "../components/RegretsMap.js";
import { createNotification } from "../context";

export default function ShareRegret() {
  const [regretInfo, setRegretInfo] = React.useState(null);
  React.useEffect(() => {
    const infoFromUrl = getUrlParams();
    setRegretInfo(infoFromUrl);
  }, []);

  function clearFindRegret() {
    setRegretInfo(null);
  }
  function trigger(cb) {
    //...do somestuff to find the svgEl
    if (typeof window === "undefined") return;
    if (!regretInfo) return;

    const searchedState = document.querySelector(
      `[data-state="${regretInfo.state}"], [data-country="${regretInfo.country}"]`
    );
    if (!searchedState) {
      createNotification("NOT_EXIST");
      return;
    }
    const type = regretInfo.state ? "STATE" : "COUNTRY";
    cb({ searchedState, type });
  }
  return (
    <Layout>
      <RegretsMap
        clearFindRegret={clearFindRegret}
        allowFindRegretById={{ ...regretInfo, trigger }}
      />
    </Layout>
  );
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const age = params.get("age");
  const gender = params.get("gender");
  const state = params.get("state");
  const country = params.get("country");
  const regret = params.get("regret");
  const id = params.get("id");

  return {
    age,
    gender,
    regret,
    country,
    state,
    id,
  };
}
