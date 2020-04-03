import React, { useRef } from "react"

//import "./Map.css"
import Map from "./Map"
import StateInfoCard from "./StateInfoCard"
import useInteractiveMap from "../hooks/useInteractiveMap"
import styled from "styled-components"
import { colors } from "../styles"
//these are the viewBox width and height for the svg
const WIDTH = 1024
const HEIGHT = 561.64917

function RegretsMap({ className }) {
  const {
    viewBox,
    zoomOut,
    activeState,
    focusInOut,
    zoomed,
  } = useInteractiveMap({ WIDTH, HEIGHT })

  return (
    <div className={className}>
      <h2>See a Sample of regrets from all over the world</h2>
      <p>These results are updated constantly</p>
      <div
        className={`${zoomed ? `zoomed` : ""} map-wrapper`}
        onClick={focusInOut}
        style={{ position: "relative", width: `100%`, height: `100%` }}
      >
        <Map {...viewBox} styles={{ width: `100%`, height: `100%` }} />

        {activeState.country && (
          <StateInfoCard zoomOut={zoomOut} activeState={activeState} />
        )}
      </div>
    </div>
  )
}
export default styled(RegretsMap)`
  padding: 50px 0;
  svg path[id] {
    transition: all 0.23s cubic-bezier(0.5, 0, 0.5, 1);
    fill: ${colors.country.base};
    &:hover {
      fill: ${colors.country.hover};
    }
  }
  .zoomed {
    path:not([data-active="true"]) {
      opacity: 0.15;
    }
  }
  svg path[id][data-active="true"] {
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
