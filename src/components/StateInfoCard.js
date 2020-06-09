import React, { useEffect } from "react";
import Icon from "./Icon";
import styled from "styled-components";
import { fonts, colors } from "../styles";
import { useGetRegrets } from "../hooks/useGetRegrets";

function StateInfoCard({
  activeState,
  zoomOut,
  className,
  isMobile,
  mapState,
}) {
  const {
    activeRegret: regret,
    getAnotherRegret,
    activeStateHasMultiple,
  } = useGetRegrets(activeState, mapState);
  console.log(isMobile);
  return (
    <div className={className}>
      <div className="active-state-info-card">
        <div className="contents">
          <button onClick={zoomOut} className="close">
            <Icon name="close" color="black" />
          </button>
          <h1>
            {regret?.location.state && regret?.location?.state + ", "}
            {regret?.location?.country}
          </h1>
          <h3>
            {regret?.gender}
            {regret?.age && `, Age ${regret.age}`}
          </h3>
          <p>{regret?.regret}</p>
          {activeStateHasMultiple && (
            <button className="next" onClick={getAnotherRegret}>
              see another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default styled(StateInfoCard)`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? "100%" : "0")};
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: ${({ isMobile }) => (isMobile ? "start" : "center")};
  .active-state-info-card {
    animation: slideIn 0.28s ease-in-out forwards;
    position: relative;
    box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
      0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    width: ${({ isMobile }) => (isMobile ? `100%` : `calc(50% - 40px)`)};
    margin: ${({ isMobile }) => (isMobile ? `0px` : `20px`)};
    .contents {
      margin-top: 20px;
      opacity: 0;
      animation: fadeIn 0.2s linear 0.28s forwards;
      button.next {
        background: ${colors.grey[2]};
        font-family: ${fonts.family};
        border: none;
        font-weight: 700;
        &:hover {
          background: #dfdfdf;
        }
      }
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
      max-height: 200px;
      overflow-x: scroll;
    }
    button.close {
      background: transparent;
      border: 1px solid transparent;
      padding: 20px;
      position: absolute;
      top: 0;
      right: 0;
      svg {
        opacity: 1;
      }
      polygon {
        fill: black;
        opacity: 1;
      }
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
`;
