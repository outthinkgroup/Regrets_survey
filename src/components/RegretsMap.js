import React, { useRef, useEffect } from "react";

//import "./Map.css"
import InteractiveMap from "./InteractiveMap";
import StateInfoCard from "./StateInfoCard";
import useInteractiveMap from "../hooks/useInteractiveMap";
import styled from "styled-components";
import { colors, screen, screenAbove } from "../styles";

import { useIsMobile } from "../hooks/useWindowWidth";
//these are the viewBox width and height for the svg
const WIDTH = 1024;
const HEIGHT = 561.64917;

function RegretsMap({ className }) {
  //functions to pass our map
  const {
    viewBox,
    zoomOut,
    activeState,
    focusInOut,
    zoomed,
  } = useInteractiveMap({ WIDTH, HEIGHT });

  const isMobile = useIsMobile();

  if (typeof window === "undefined") return null;
  return (
    <div className={className}>
      <div className="heading-card">
        <h2>Past Survey Response</h2>
      </div>

      <div
        className={`${zoomed ? `zoomed` : ""} map-wrapper`}
        onClick={focusInOut}
        style={{
          position: "relative",
          width: `100%`,
          height: `100%`,
        }}
      >
        <InteractiveMap
          viewBox={viewBox}
          styles={{ width: `100%`, height: `100%` }}
        />

        {activeState && (
          <StateInfoCard
            zoomOut={zoomOut}
            isMobile={isMobile}
            invis={true}
            activeState={activeState}
          />
        )}
      </div>
    </div>
  );
}
export default styled(RegretsMap)`
  padding: 50px 0 100px;

  .heading-card {
    width: auto;
    display: flex;
    justify-content: center;
  }
  h2 {
    font-size: 20px;
    background: white;
    position: relative;
    z-index: 2;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    @media (min-width: 562px) {
      font-size: 22px;
      transform: translateY(20px);
      margin: 0;
    }
    padding: 10px 25px;
    display: inline-block;
    border-radius: 5px;

    text-align: center;
  }
  svg {
    & > * {
      transition: all 0.23s cubic-bezier(0.5, 0, 0.5, 1);
      fill: ${colors.country.base};
      &:hover {
        fill: ${colors.country.hover};
      }
    }
  }
  .zoomed {
    [id][data-active="true"] path {
      opacity: 1;
    }
    [id]:not([data-active="true"]) {
      opacity: 0.4;
    }
  }
  [data-active="true"] {
    fill: ${colors.country.active};
    &:hover {
      fill: ${colors.country.active};
    }
  }
  .map-wrapper {
    padding: 0px 0;
    position: relative;
  }
`;
