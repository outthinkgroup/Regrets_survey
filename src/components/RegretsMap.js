import React, { useRef, useEffect } from "react"

//import "./Map.css"
import InteractiveMap from "./InteractiveMap"
import StateInfoCard from "./StateInfoCard"
import useInteractiveMap from "../hooks/useInteractiveMap"
import styled from "styled-components"
import { colors } from "../styles"
//these are the viewBox width and height for the svg
const WIDTH = 1024
const HEIGHT = 561.64917

const data = {
  countries: [
    {
      id: "Slovakia",
      survey_count: 53,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
    {
      id: "Georgia",
      survey_count: 23,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
    {
      id: "Mongolia",
      survey_count: 13,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
    {
      id: "Kenya",
      survey_count: 76,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
    {
      id: "Japan",
      survey_count: 102,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
    {
      id: "america",
      survey_count: 344,
      regrets: [
        "I ate too much pasta",
        "I never saw terminator",
        "I never believed in santa",
      ],
    },
  ],
}

function RegretsMap({ className }) {
  //functions to pass our map
  const {
    viewBox,
    zoomOut,
    activeState,
    focusInOut,
    zoomed,
  } = useInteractiveMap({ WIDTH, HEIGHT })

  const countryScale = 50
  const countryColor = `hsl(50, 0, ${countryScale})`

  useEffect(() => {
    if (activeState) {
    }
  }, [activeState])

  return (
    <div className={className}>
      <h2>See a Sample of regrets from all over the world</h2>
      <p>These results are updated constantly</p>
      <div
        className={`${zoomed ? `zoomed` : ""} map-wrapper`}
        onClick={focusInOut}
        style={{ position: "relative", width: `100%`, height: `100%` }}
      >
        <InteractiveMap
          {...viewBox}
          styles={{ width: `100%`, height: `100%` }}
        />

        {activeState && (
          <StateInfoCard zoomOut={zoomOut} activeState={activeState} />
        )}
      </div>
    </div>
  )
}
export default styled(RegretsMap)`
  padding: 50px 0;
  svg > * {
    transition: all 0.23s cubic-bezier(0.5, 0, 0.5, 1);
    fill: ${colors.country.base};
    &:hover {
      fill: ${colors.country.hover};
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
    padding: 20px 0;
    position: relative;
  }
`
