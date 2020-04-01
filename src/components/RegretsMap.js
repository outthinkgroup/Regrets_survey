import React, { useRef } from "react"

import "./Map.css"
import Map from "./Map"
import { useState, useEffect } from "react"

const WIDTH = 1009.6727
const HEIGHT = 665.96301
export default function RegretsMap() {
  const svgRef = useRef()
  const [zoomed, setZoomed] = useState(false)

  const [xPos, setXPos] = useState(0)
  const [yPos, setYPos] = useState(0)
  const [width, setWidth] = useState(WIDTH)
  const [height, setHeight] = useState(HEIGHT)
  const viewBox = {
    xPos,
    yPos,
    width,
    height,
  }

  function animateViewBoxScale(nextXPos, nextYPos, nextWidth, nextHeight) {
    let distanceTraveled = 0
    const speed = 20

    const widthUnit = nextWidth / speed
    const heightUnit = nextHeight / speed
    const xPosUnit = nextXPos / speed
    const yPosUnit = nextYPos / speed
    const animateValue = () => {
      setWidth(prevState => prevState - widthUnit)
      setHeight(prevState => prevState - heightUnit)
      setXPos(prevState => prevState + xPosUnit)
      setYPos(prevState => prevState + yPosUnit)
      distanceTraveled += 1

      if (distanceTraveled !== speed) {
        requestAnimationFrame(animateValue)
      }
    }
    requestAnimationFrame(animateValue)
  }

  const focusOnState = e => {
    const state = e.target.getBoundingClientRect()
    const svg = e.target.parentElement.getBoundingClientRect()

    const stateRelative = {
      width: (state.width / svg.width) * WIDTH,
      height: (state.height / svg.height) * HEIGHT,
      x: ((state.left - svg.left) / svg.width) * WIDTH,
      y: ((state.top - svg.top) / svg.height) * HEIGHT,
    }
    console.log(stateRelative)
    if (!zoomed) {
      if (!e.target.id || e.target.id === "DC2") return
      e.target.dataset.active = "true"

      const orientation = getOrientation(
        width,
        height,
        stateRelative.width,
        stateRelative.height
      )
      //readjust to allow card to fit
      const viewPort = {}
      viewPort.width = stateRelative.width * 2
      viewPort.height = stateRelative.height * 2
      let measurementBasedOnRatio
      if (orientation === width) {
        viewPort.height = getRatio(height, width, viewPort.width)
        measurementBasedOnRatio = viewPort.height
      } else {
        viewPort.width = getRatio(width, height, viewPort.height)
        measurementBasedOnRatio = viewPort.width
      }

      if (measurementBasedOnRatio < stateRelative.height) {
        console.log("off")
        const offBy = stateRelative.height - measurementBasedOnRatio
        viewPort.height = offBy + measurementBasedOnRatio
        viewPort.width = getRatio(width, height, viewPort.height)
      }

      const getDistance = newViewBox => {
        const distanceWidth = width - newViewBox.width
        const distanceHeight = height - newViewBox.height
        return { distanceWidth, distanceHeight }
      }
      const { distanceWidth, distanceHeight } = getDistance(viewPort)
      animateViewBoxScale(
        stateRelative.x,
        stateRelative.y,
        distanceWidth,
        distanceHeight
      )
    } else {
      animateViewBoxScale(xPos * -1, yPos * -1, width - WIDTH, height - HEIGHT)
      delete document.querySelector("[data-active='true']").dataset.active
    }
    setZoomed(!zoomed)
  }

  return (
    <div
      className={zoomed && `zoomed`}
      onClick={focusOnState}
      style={{ position: "relative", width: `100%`, height: `100%` }}
    >
      <Map
        {...viewBox}
        ref={svgRef}
        styles={{ width: `100%`, height: `100%` }}
      />
    </div>
  )
}

function getOrientation(width, height, stateWidth, stateHeight) {
  const orientation = stateWidth >= stateHeight ? width : height
  return orientation
}
function getRatio(
  measurementToChange,
  comparingMeasurement,
  newComparingMeasurement
) {
  return (newComparingMeasurement / comparingMeasurement) * measurementToChange
}

/* 
1. get state relative size to svg
2. figure out the orientation
3. find the differences between full size and state size
4. we check to see if state fits in viewbox 
    - if not re-adjust height
5.find state position
*/
