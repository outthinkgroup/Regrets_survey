import { useState, useReducer } from "react";
import { useSpring } from "react-spring";
import { useIsMobile } from "./useWindowWidth";

const WORLD = "WORLD";
const COUNTRY = "COUNTRY";
const STATE = "STATE";

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
        console.log(e);
        if (!e.target.dataset.country && !e.target.dataset.state) return;
        const target = e.target.dataset.state
          ? e.target.closest("[data-country]")
          : e.target;
        zoomTo(target);
        return COUNTRY;
      },
    },
    COUNTRY: {
      click: (e) => {
        console.log(e);
        if (!e.target.dataset.state && !e.target.closest(`[data-state]`))
          return COUNTRY;
        const target = !e.target.dataset.state
          ? e.target.closest("[data-state]")
          : e.target;
        zoomTo(target);
        return STATE;
      },
      close: () => {
        resetMapState();
        return WORLD;
      },
    },
    STATE: {
      zoomOut: () => {
        console.log("now will be in Country State");
        return COUNTRY;
      },
    },
  };
  const reducer = (state, event) => {
    const [eventName, data] = event;
    console.log(eventName);
    const nextState = MACHINE[state][eventName](data);
    //console.log(nextState);
    return nextState;
  };
  const [mapState, send] = useReducer(reducer, WORLD);

  function animateViewBoxScale(nextXPos, nextYPos, nextWidth, nextHeight) {
    setViewBox({ viewBox: [nextXPos, nextYPos, nextWidth, nextHeight] });
  }

  function resetMapState() {
    //send("zoomOut");
    if (activeState === null) return;
    setActiveState(null);
    setZoomed(false);
    delete document.querySelector("[data-active='true']").dataset.active;

    animateViewBoxScale(0, 0, WIDTH, HEIGHT);
  }

  function zoomTo(targetEl) {
    console.log(targetEl);
    //send("countrySelect");
    //if (!targetEl.dataset.hasentries) return;
    const targetRect = targetEl.getBoundingClientRect();
    const svgEl = targetEl.closest("svg") || targetEl;
    const svgRect = svgEl.getBoundingClientRect();

    const relativeSizeToSvg = {
      width: (targetRect.width / svgRect.width) * WIDTH,
      height: (targetRect.height / svgRect.height) * HEIGHT,
      x: ((targetRect.left - svgRect.left) / svgRect.width) * WIDTH,
      y: ((targetRect.top - svgRect.top) / svgRect.height) * HEIGHT,
    };
    //if (!stateEl.hasAttribute("d")) return;

    setActiveState(targetEl.dataset.country);

    targetEl.dataset.active = "true";

    setZoomed(!zoomed);

    //starts the viewBox size
    const orientation = getOrientation(
      WIDTH,
      HEIGHT,
      relativeSizeToSvg.width,
      relativeSizeToSvg.height
    );

    //readjust to allow card to fit
    const viewPort = {};
    //if its mobile position the country in the middle of viewport else
    //position it the right for the card to go be side it

    function setViewBoxWidthSize() {
      let width;
      if (!isMobile) {
        width = relativeSizeToSvg.width * 2;
      } else {
        width = relativeSizeToSvg.width;
      }
      return width;
    }
    function setViewBoxHeightSize() {
      let height;
      if (!isMobile) {
        height = relativeSizeToSvg.height * 2;
      } else {
        height = relativeSizeToSvg.height;
      }
      return height;
    }
    function setViewBoxXPos() {
      let x;
      if (!isMobile) {
        x = relativeSizeToSvg.x - (viewPort.width - relativeSizeToSvg.width);
        x = x + (viewPort.width / 2 - relativeSizeToSvg.width) / 2;
      } else {
        x =
          relativeSizeToSvg.x - (viewPort.width - relativeSizeToSvg.width) / 2;
      }

      return x;
    }

    viewPort.width = setViewBoxWidthSize();
    viewPort.height = setViewBoxHeightSize();
    let measurementBasedOnRatio;
    if (orientation === WIDTH) {
      viewPort.height = getRatio(HEIGHT, WIDTH, viewPort.width);
      measurementBasedOnRatio = viewPort.height;
    } else {
      viewPort.width = getRatio(WIDTH, HEIGHT, viewPort.height);
      measurementBasedOnRatio = viewPort.width;
    }

    if (measurementBasedOnRatio < relativeSizeToSvg.height) {
      const offBy = relativeSizeToSvg.height - measurementBasedOnRatio;
      viewPort.height = offBy + measurementBasedOnRatio;
      viewPort.width = getRatio(WIDTH, HEIGHT, viewPort.height);
    }

    //start viewBox Position
    viewPort.x = setViewBoxXPos();
    viewPort.y =
      relativeSizeToSvg.y - (viewPort.height - relativeSizeToSvg.height) / 2;
    console.log({
      X: viewPort.x,
      Y: viewPort.y,
      Width: viewPort.width,
      Height: viewPort.height,
    });
    animateViewBoxScale(
      viewPort.x,
      viewPort.y,
      viewPort.width,
      viewPort.height
    );
  }

  function focusInOut(e) {
    e.persist();
    let stateEl = e.target;
    console.log(stateEl);
    if (!stateEl.dataset.country && !stateEl.dataset.state) return;
    if (e.target.closest("[data-country]")) {
      console.log("should be america");
      stateEl = e.target.closest("[data-country]");
    }
    if (
      e.target.classList.contains("active-state-info-card") ||
      e.target.closest(".active-state-info-card")
    )
      return;
    if (!zoomed) {
      zoomTo(stateEl);
    } else {
      resetMapState();
    }
  }
  return {
    viewBox,
    focusInOut,
    activeState,
    resetMapState,
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
