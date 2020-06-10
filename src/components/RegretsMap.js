import React, { useRef, useEffect } from "react";

//import "./Map.css"
import InteractiveMap from "./InteractiveMap";
import StateInfoCard from "./StateInfoCard";
import useInteractiveMap from "../hooks/useInteractiveMap";
import styled, { css } from "styled-components";
import { colors, screen, screenAbove, elevation, fonts } from "../styles";
import CountrySearch from "./CountrySearch";
import { useIsMobile } from "../hooks/useWindowWidth";
import Icon from "./Icon.js";
//these are the viewBox width and height for the svg
const WIDTH = 1024;
const HEIGHT = 561.64917;

function RegretsMap({ className }) {
  //functions to pass our map
  const { viewBox, activeState, zoomed, send, mapState } = useInteractiveMap({
    WIDTH,
    HEIGHT,
  });

  const isMobile = useIsMobile();

  return (
    <div className={className}>
      <div className="heading-card">
        <h2>What do others regret?</h2>
        <p>
          Click a country or state, or search by <em>country</em> or{" "}
          <em>state</em>, to see a selection of survey responses from that area.
        </p>
      </div>

      <div
        className={`${zoomed ? `zoomed` : ""} map-wrapper, ${mapState}`}
        style={{
          position: "relative",
          width: `100%`,
          height: `100%`,
        }}
      >
        {mapState === "PARENT_COUNTRY" || !activeState ? (
          <CountrySearch send={send} />
        ) : null}
        <div style={{ position: `relative` }}>
          <InteractiveMap
            onClick={(e) => {
              console.log("called");
              e.persist();
              send(["click", e]);
            }}
            viewBox={viewBox}
            activeState={activeState}
            mapState={mapState}
            styles={{ width: `100%`, height: `100%` }}
          />
          {mapState !== "WORLD" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                send(["close"]);
              }}
              className="zoomout"
              style={{
                background: `transparent`,
                border: `none`,
                position: `absolute`,
                top: `5px`,
                left: `5px`,
              }}
            >
              <span
                style={{ width: `20px`, marginRight: `10px`, marginTop: `7px` }}
              >
                <Icon name="zoom-out" color="black" />
              </span>
              <span>zoom out</span>
            </button>
          )}
        </div>
        {mapState !== "PARENT_COUNTRY" && activeState && (
          <StateInfoCard
            zoomOut={(e) => {
              e.stopPropagation();
              send(["close"]);
            }}
            mapState={mapState}
            isMobile={isMobile}
            activeState={activeState}
          />
        )}
      </div>
    </div>
  );
}
export default styled(RegretsMap)`
  margin: 50px 0 100px;

  h2 {
    background: white;
    position: relative;
    z-index: 2;
    margin-bottom: 20px;
    display: inline-block;
    border-radius: 5px;
    margin-bottom: 5px;
    text-align: center;
  }
  .map {
    ${elevation[3]};
    background: ${colors.grey[0]};
    & > * {
      transition: all 0.23s cubic-bezier(0.5, 0, 0.5, 1);
      fill: ${colors.country.base};
    }
  }
  .WORLD {
    svg {
      [data-country][data-hasentries] {
        &:hover {
          fill: ${colors.country.hover};
        }
      }
    }
  }
  .PARENT_COUNTRY {
    svg {
      [data-active] [data-state][data-hasentries] {
        &:hover {
          fill: ${colors.country.hover};
        }
      }
    }
  }

  .zoomed {
    [data-country],
    [data-state] {
      &[data-active="true"] path {
        opacity: 1;
      }
    }
    &.PARENT_COUNTRY,
    &.COUNTRY,
    &.STATE {
      [data-country]:not([data-active="true"]) {
        opacity: 0.4;
      }
    }
    &.STATE {
      [data-country][data-active] {
        fill: ${colors.grey[2]};
      }
    }
  }
  [data-active="true"] {
    fill: ${colors.country.active};
    &:hover {
      fill: ${colors.country.active};
    }
  }
  .PARENT_COUNTRY {
    [data-country][data-active="true"] {
      fill: unset;
    }
    [data-country]:not([data-active="true"]) {
      pointer-events: none;
    }
    [data-state] {
      fill: ${colors.country.base};
    }
  }

  .map-wrapper {
    padding: 0px 0;
    position: relative;
  }
  button.zoomout {
    display: flex;
    position: relative;
    z-index: 11;
    align-items: center;
    font-family: ${fonts.family};
    span {
      display: block;
    }
  }
`;
