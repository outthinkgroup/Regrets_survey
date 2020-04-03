import React from "react"
import Icon from "./Icon"
import styled from "styled-components"
import { fonts, colors } from "../styles"

function StateInfoCard({ activeState, zoomOut, className }) {
  const { state, country } = activeState
  return (
    <div className={className}>
      <div className="active-state-info-card">
        <div className="contents">
          <button onClick={zoomOut} className="close">
            <Icon name="close" />
          </button>
          <h1>
            {country}
            {state && `, ${state}`}
          </h1>
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
export default styled(StateInfoCard)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .active-state-info-card {
    animation: slideIn 0.28s ease-in-out forwards;
    position: relative;
    box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
      0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    width: calc(50% - 40px);
    max-width: 400px;
    margin: 20px;
    .contents {
      margin-top: 20px;
      opacity: 0;
      animation: fadeIn 0.2s linear 0.28s forwards;
    }
    h1 {
      font-size: ${fonts.sizes.heading[0]};
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h3 {
      font-size: ${fonts.sizes.heading[2]};
    }
    p {
      font-size: ${fonts.sizes.copy};
      line-height: 2em;
    }
    button.close {
      background: transparent;
      border: 1px solid transparent;
      padding: 20px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  @keyframes slideIn {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
