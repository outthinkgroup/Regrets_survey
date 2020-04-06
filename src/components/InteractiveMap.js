import React from "react"
import WorldMap from "./WorldMap"

export default function InteractiveMap({ xPos, yPos, width, height }) {
  return <WorldMap xPos={xPos} yPos={yPos} width={width} height={height} />
}
