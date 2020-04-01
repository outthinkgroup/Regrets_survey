import React from "react"
import Icon from "./Icon"
import "./StateInfoCard.css"
export default function StateInfoCard({ activeState, zoomOut }) {
  const { state, stateId } = activeState
  return (
    <div class="active-state-info-wrapper">
      <div className="active-state-info-card">
        <div className="contents">
          <button onClick={zoomOut} className="close">
            <Icon name="close" />
          </button>
          <h1>{state}</h1>
          <h3>Anonymous Regret</h3>
          <p>
            Tortor arcu porttitor ornare platea aliquam hendrerit ullamcorper
            ipsum porta, sociosqu nunc lacus vestibulum nisi suscipit dictumst
            lobortis a neque, purus nam id torquent potenti euismod vivamus
            bibendum. Diam quam hac efficitur mi accumsan suscipit vivamus
            placerat, habitant mattis in elementum amet lacus taciti massa, sit
            sapien iaculis duis volutpat non torquent.
          </p>
        </div>
      </div>
    </div>
  )
}
