import { useState, useReducer } from "react";
import { useSpring } from "react-spring";
import { useIsMobile } from "./useWindowWidth";

const WORLD = "WORLD";
const COUNTRY = "COUNTRY";
const STATE = "STATE";
const PARENT_COUNTRY = "PARENT_COUNTRY";

export default function useInteractiveMap({ WIDTH, HEIGHT }) {
  const noActiveState = {
    country: null,
  };

  const [zoomed, setZoomed] = useState(false);
  const [activeState, setActiveState] = useState(null);

  const isMobile = useIsMobile();

  const [{ viewBox }, setViewBox] = useSpring(() => ({
    viewBox: [0, 0, WIDTH, HEIGHT],
  }));

  const MACHINE = {
    WORLD: {
      click: (e) => {
        if (!e.target.dataset.country && !e.target.dataset.state) return WORLD;

        const target = e.target.dataset.state
          ? e.target.closest("[data-country]")
          : e.target;

        if (!target.dataset.hasentries) {
          console.log("because no entries");
          return WORLD;
        }
        const hideActiveState = target.dataset.hasChildren; // boolean
        zoomTo(target, hideActiveState);

        if (target.dataset.hasChildren) {
          return PARENT_COUNTRY;
        } else {
          return COUNTRY;
        }
      },
      searched: (data) => searched(data),
    },
    PARENT_COUNTRY: {
      click: (e) => {
        console.log(e);
        if (
          !e.target.dataset.state &&
          !e.target.closest(`[data-state]`) &&
          !e.target.closest(`[data-state]`)
        )
          return PARENT_COUNTRY;

        const target = !e.target.dataset.state
          ? e.target.closest("[data-state]")
          : e.target;

        if (!target.dataset.hasentries) return PARENT_COUNTRY;

        zoomTo(target);
        return STATE;
      },
      close: () => {
        resetMapState();
        return WORLD;
      },
      searched: (data) => searched(data),
    },
    COUNTRY: {
      click: (e) => {
        return COUNTRY;
      },
      close: () => {
        resetMapState();
        return WORLD;
      },
      searched: (data) => searched(data),
    },
    STATE: {
      click: () => {
        return STATE;
      },
      close: () => {
        zoomBackOnce();
        return PARENT_COUNTRY;
      },
      searched: (data) => searched(data),
    },
  };
  const reducer = (state, event) => {
    const [eventName, data] = event;
    console.log({ StateBEFORE: state, data });
    const nextState = MACHINE[state][eventName](data);
    console.log({ StateAFTER: nextState });
    return nextState;
  };
  const [mapState, send] = useReducer(reducer, WORLD);

  function animateViewBoxScale(nextXPos, nextYPos, nextWidth, nextHeight) {
    setViewBox({ viewBox: [nextXPos, nextYPos, nextWidth, nextHeight] });
  }

  function resetMapState() {
    //send("zoomOut");
    if (zoomed === false) return;
    setActiveState(null);
    setZoomed(false);

    [...document.querySelectorAll("[data-active='true']")].forEach(
      (el) => delete el.dataset.active
    );

    animateViewBoxScale(0, 0, WIDTH, HEIGHT);
  }

  function searched({ searchedState, type }) {
    if (!searchedState.dataset.hasentries) {
      console.log({ mapState });
      return mapState;
    }

    if (type === COUNTRY || type === STATE) {
      if (type === STATE) {
        console.log("the country is active too");
        searchedState.closest("[data-country]").active = "true";
      }
      zoomTo(searchedState);
    } else {
      zoomTo(searchedState, false);
    }

    return type;
  }

  function zoomBackOnce() {
    if (!activeState) return;
    const stateEl = document.querySelector(`[data-state="${activeState}"]`);
    const countryEl = stateEl.closest("[data-country]");
    zoomTo(countryEl, true);
    setActiveState(null);
    [...countryEl.querySelectorAll("[data-active='true']")].forEach(
      (el) => delete el.dataset.active
    );
  }

  function zoomTo(targetEl, hideActiveState) {
    const targetRect = targetEl.getBoundingClientRect();
    const svgEl = targetEl.closest("svg") || targetEl;

    const currentViewBox = getViewBoxFromString(svgEl);
    const svgRect = svgEl.getBoundingClientRect();

    const ratio = currentViewBox.width / WIDTH;
    const relativeSizeToSvg = {
      width: (targetRect.width / svgRect.width) * WIDTH,
      height: (targetRect.height / svgRect.height) * HEIGHT,
      x: ((targetRect.left - svgRect.left) / svgRect.width) * WIDTH,
      y: ((targetRect.top - svgRect.top) / svgRect.height) * HEIGHT,
    };

    setActiveState(targetEl.dataset.state || targetEl.dataset.country);
    targetEl.dataset.active = "true";
    if (!hideActiveState) {
    }

    setZoomed(true);

    //starts the viewBox size
    const orientation = getOrientation(
      WIDTH,
      HEIGHT,
      relativeSizeToSvg.width,
      relativeSizeToSvg.height
    );

    //readjust to allow card to fit
    const newViewPort = {};

    newViewPort.width = setViewBoxWidthSize();
    newViewPort.height = setViewBoxHeightSize();
    let measurementBasedOnRatio;
    if (orientation === WIDTH) {
      newViewPort.height = getRatio(HEIGHT, WIDTH, newViewPort.width);
      measurementBasedOnRatio = newViewPort.height;
    } else {
      newViewPort.width = getRatio(WIDTH, HEIGHT, newViewPort.height);
      measurementBasedOnRatio = newViewPort.width;
    }

    if (measurementBasedOnRatio < relativeSizeToSvg.height) {
      const offBy = relativeSizeToSvg.height - measurementBasedOnRatio;
      newViewPort.height = offBy + measurementBasedOnRatio;
      newViewPort.width = getRatio(WIDTH, HEIGHT, newViewPort.height);
    }

    function getGoalViewBoxPos({ actualUnit, currentUnit }) {
      return actualUnit * ratio + currentUnit;
    }
    function getGoalViewBoxSize({ actualUnit }) {
      return actualUnit * ratio;
    }

    //start viewBox Position
    newViewPort.x = setViewBoxXPos();
    newViewPort.y =
      relativeSizeToSvg.y - (newViewPort.height - relativeSizeToSvg.height) / 2;

    const goalViewPort = getGoalViewPort(newViewPort);

    animateViewBoxScale(
      goalViewPort.x,
      goalViewPort.y,
      goalViewPort.width,
      goalViewPort.height
    );

    //function ends below is the inner functions

    //if its mobile position the country in the middle of viewport else
    //position it the right for the card to go be side it
    function setViewBoxWidthSize() {
      let width;
      if (!isMobile && !hideActiveState) {
        //cut in half
        width = relativeSizeToSvg.width * 2;
      } else {
        // take up full width
        width = relativeSizeToSvg.width;
      }
      return width;
    }
    function setViewBoxHeightSize() {
      let height;
      if (!isMobile && !hideActiveState) {
        height = relativeSizeToSvg.height * 2;
      } else {
        height = relativeSizeToSvg.height;
      }
      return height;
    }
    function setViewBoxXPos() {
      let x;
      if (!isMobile && !hideActiveState) {
        x = relativeSizeToSvg.x - (newViewPort.width - relativeSizeToSvg.width);
        x = x + (newViewPort.width / 2 - relativeSizeToSvg.width) / 2;
      } else {
        x =
          relativeSizeToSvg.x -
          (newViewPort.width - relativeSizeToSvg.width) / 2;
      }

      return x;
    }

    function getGoalViewPort(newViewPort) {
      const { x, y, width, height } = newViewPort;

      return {
        x: getGoalViewBoxPos({
          actualUnit: x,
          currentUnit: currentViewBox.x,
          ratio,
        }),
        y: getGoalViewBoxPos({
          actualUnit: y,
          currentUnit: currentViewBox.y,
          ratio,
        }),
        width: getGoalViewBoxSize({
          actualUnit: width,
          ratio,
        }),
        height: getGoalViewBoxSize({
          actualUnit: height,
          ratio,
        }),
      };
    }
    //end of zoomTo
  }

  return {
    viewBox,
    activeState,
    zoomed,
    zoomTo,
    send,
    mapState,
  };
} //end hook

function getOrientation(width, height, stateWidth, stateHeight) {
  const orientation = stateWidth >= stateHeight ? width : height;
  return orientation;
}
function getRatio(
  measurementToChange,
  comparingMeasurement,
  newComparingMeasurement
) {
  return (newComparingMeasurement / comparingMeasurement) * measurementToChange;
}

function getViewBoxFromString(svgEl) {
  const currentViewBoxArray = svgEl
    .getAttribute("viewBox")
    .split(" ")
    .map((viewBoxUnit) => parseInt(viewBoxUnit));
  const [x, y, width, height] = currentViewBoxArray;
  return {
    x,
    y,
    width,
    height,
  };
}
