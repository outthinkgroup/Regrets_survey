import React from "react";
import Icon from "./Icon";
import styled from "styled-components";
import { fonts, colors } from "../styles";
import { useGetRegrets } from "../hooks/useGetRegrets";

export default function StateInfoCard({
  activeState,
  zoomOut,
  isMobile,
  mapState,
}) {
  const {
    activeRegret: regret,
    getAnotherRegret,
    activeStateHasMultiple,
  } = useGetRegrets(activeState, mapState);
  console.log(isMobile);
  if (!regret) return null;
  return (
    <RegretCard
      header={
        <button onClick={zoomOut} className="close">
          <Icon name="close" color="black" />
        </button>
      }
      location={regret.location}
      isMobile={isMobile}
      gender={regret.gender}
      age={regret.age}
      regret={regret.regret}
      shouldAnimate={true}
      footer={
        activeStateHasMultiple && (
          <button className="next" onClick={getAnotherRegret}>
            see another
          </button>
        )
      }
    />
  );
}

const RegretCardUnStyled = ({
  className,
  location,
  gender,
  age,
  regret,
  header,
  footer,
}) => {
  return (
    <div className={className}>
      <div className="active-state-info-card">
        <div className="contents">
          {header}
          <h1>
            {location && location.state ? location.state + ", " : ""}
            {location && location.country}
          </h1>
          <h3>
            {gender && gender}
            {age && `, Age ${age}`}
          </h3>
          <p>{regret}</p>
          {footer}
        </div>
      </div>
    </div>
  );
};

export const RegretCard = styled(RegretCardUnStyled)`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? "100%" : "0")};
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: ${({ isMobile }) => (isMobile ? "start" : "center")};
  .active-state-info-card {
    animation: ${({ shouldAnimate }) =>
      shouldAnimate ? "slideIn 0.28s ease-in-out forwards" : "none"};
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
      opacity: ${({ shouldAnimate }) => (shouldAnimate ? 0 : 1)};
      animation: ${({ shouldAnimate }) =>
        shouldAnimate ? "fadeIn 0.2s linear 0.28s forwards" : "none"};
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
