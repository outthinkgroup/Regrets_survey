import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";
import { fonts, colors, elevation, breakpoints } from "../styles";
import { useNotification } from "../context";

export default function Notifications() {
  const { notifications } = useNotification();
  const transition = useTransition(notifications, {
    from: { opacity: 0, height: `0`, y: 0 },
    key: (item) => item.id,
    enter: () => async (next) => {
      await next({
        opacity: 1,
        height: `auto`,
        y: 0,
      });
    },
    leave: () => async (next) => {
      await next({ y: -20, opacity: 0 });
      await next({ height: "0" });
    },
  });

  return (
    <NotificationList>
      {transition((style, item) => {
        console.log(style.transform);
        return (
          <StyledNotification
            style={{
              ...style,
              transform: style.y.to((y) => `translateY(${y}px)`),
            }}
            key={item}
          >
            {item.message}
          </StyledNotification>
        );
      })}
    </NotificationList>
  );
}
const NotificationList = styled.ul`
  z-index: 99;
  position: fixed;
  bottom: 10px;
  margin: 0;
  padding: 0;
  right: 5vw;
  ${(props) => console.log(props.isMobile)}
  width: 90vw;
  font-family: ${fonts.family};
  font-weight: 700;
  list-style: none;
  @media (min-width: ${breakpoints.small}) {
    width: 33%;
    float: right;
  }
`;
const StyledNotification = styled(animated.li)`
  background: ${colors.error.light};
  padding: 20px;
  color: ${colors.error.dark};
  border-radius: 8px;
  ${elevation[2]}
`;
