import React, { useRef } from "react"

import "./Map.css"
import Map from "./Map"
import { useState, useEffect } from "react"

const WIDTH = 959
const HEIGHT = 593
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
    const svg = e.target.parentElement.parentElement.getBoundingClientRect()

    const stateRelative = {
      width: (state.width / svg.width) * WIDTH,
      height: (state.height / svg.height) * HEIGHT,
      x: ((state.left - svg.left) / svg.width) * WIDTH,
      y: ((state.top - svg.top) / svg.height) * HEIGHT,
    }

    //sets it to be half the size of the viewport
    const twiceStateWidth = stateRelative.width * 2
    const twiceStateHeight = getRatio(
      stateRelative.height,
      stateRelative.width,
      twiceStateWidth * 0.8
    )

    const orientation = getOrientation(
      width,
      height,
      twiceStateWidth,
      twiceStateHeight
    )
    const heightAndWidthViewPort = () => {
      if (orientation === width) {
        const widthViewPort = twiceStateWidth
        const heightViewPort = getRatio(height, width, twiceStateWidth)
        return { widthViewPort, heightViewPort }
      } else {
        const heightViewPort = twiceStateHeight
        const widthViewPort = getRatio(width, height, twiceStateHeight)
        return { widthViewPort, heightViewPort }
      }
    }

    const { widthViewPort, heightViewPort } = heightAndWidthViewPort()
    const distanceWidth = width - widthViewPort
    const distanceHeight = height - heightViewPort
    const distanceXPos =
      stateRelative.x - xPos - widthViewPort + twiceStateWidth / 2
    const distanceYPos =
      stateRelative.y - yPos - heightViewPort + twiceStateHeight * 0.75

    const viewPort = {
      distanceXPos,
      distanceYPos,
      distanceWidth,
      distanceHeight,
    }

    animateViewBoxScale(
      viewPort.distanceXPos,
      viewPort.distanceYPos,
      viewPort.distanceWidth,
      viewPort.distanceHeight
    )
  }

  return (
    <div
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

function getOrientation(width, height, nextWidth, nextHeight) {
  const orientation = nextWidth >= nextHeight ? width : height
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
