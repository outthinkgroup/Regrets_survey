import React, { useRef } from "react"

import "./Map.css"
import Map from "./Map"
import { useState, useEffect } from "react"

export default function RegretsMap() {
  const WIDTH = 959
  const fullHeight = 593
  const svgRef = useRef()
  const [zoomed, setZoomed] = useState(false)

  const [xPos, setXPos] = useState(0)
  const [yPos, setYPos] = useState(0)
  const [width, setWidth] = useState(WIDTH)
  const [height, setHeight] = useState(fullHeight)
  const viewBox = {
    xPos,
    yPos,
    width,
    height,
  }

  const animateViewBoxScale = (nextXPos, nextYPos, nextWidth, nextHeight) => {
    let distanceTraveled = 0
    const speed = 50
    const { distanceHeight, distanceWidth } = widthHeightDistance(
      width,
      height,
      nextWidth,
      nextHeight
    )
    const distanceXPos = nextXPos - xPos
    const distanceYPos = nextYPos - yPos
    const widthUnit = distanceWidth / speed
    const heightUnit = distanceHeight / speed
    const xPosUnit = distanceXPos / speed
    const yPosUnit = distanceYPos / speed
    const animateValue = () => {
      setWidth(prevState => prevState - widthUnit)
      setHeight(prevState => prevState - heightUnit)
      setXPos(prevState => prevState + xPosUnit)
      setYPos(prevState => prevState + yPosUnit)
      distanceTraveled += 1
      const checkValue =
        distanceWidth > distanceHeight ? distanceWidth : distanceHeight
      if (distanceTraveled !== speed) {
        requestAnimationFrame(animateValue)
      }
    }
    requestAnimationFrame(animateValue)
  }

  const [testCo, setTestCo] = useState({ x: 0, y: 0 })

  const zoomHalf = e => {
    console.log(svgRef)
    const state = e.target.getBoundingClientRect()
    const svg = e.target.parentElement.parentElement.getBoundingClientRect()
    const stateRelative = {
      width: (state.width / svg.width) * WIDTH,
      height: (state.height / svg.height) * fullHeight,
      x: ((state.left - svg.left) / svg.width) * WIDTH,
      y: ((state.top - svg.top) / svg.height) * fullHeight,
    }
    console.table({ stateRelative, svg, state })

    animateViewBoxScale(
      stateRelative.x,
      stateRelative.y,
      stateRelative.width,
      stateRelative.height
    )

    setTestCo({ x: stateRelative.x, y: stateRelative.y })
  }

  return (
    <div
      onClick={zoomHalf}
      style={{ position: "relative", width: `100%`, height: `100%` }}
    >
      <span
        style={{
          backgroundColor: "red",
          position: "absolute",
          top: testCo.y,
          left: testCo.x,
          width: "20px",
          height: `20px`,
        }}
      >
        {""}
      </span>
      <Map
        {...viewBox}
        ref={svgRef}
        styles={{ width: `100%`, height: `100%` }}
      />
    </div>
  )
}

function widthHeightDistance(width, height, nextWidth, nextHeight) {
  const orientation = nextWidth - width >= nextHeight - height ? width : height
  if (orientation === width) {
    const distanceWidth = width - nextWidth
    const distanceHeight = height - (nextWidth / width) * height
    return { distanceWidth, distanceHeight }
  } else {
    const distanceHeight = height - nextHeight
    const distanceWidth = width - (nextHeight / height) * width
    return { distanceWidth, distanceHeight }
  }
}
