import { useState } from "react";
import { useSpring } from "react-spring";
import { useIsMobile } from "./useWindowWidth";
export default function useInteractiveMap({ WIDTH, HEIGHT }) {
  const noActiveState = {
    country: null,
  };

  const [zoomed, setZoomed] = useState(false);
  const [activeState, setActiveState] = useState(null);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [width, setWidth] = useState(WIDTH);
  const [height, setHeight] = useState(HEIGHT);

  const isMobile = useIsMobile();

  const [{ viewBox }, setViewBox] = useSpring(() => ({
    viewBox: [0, 0, WIDTH, HEIGHT],
  }));

  function animateViewBoxScale(nextXPos, nextYPos, nextWidth, nextHeight) {
    setViewBox({ viewBox: [nextXPos, nextYPos, nextWidth, nextHeight] });
  }

  function zoomOut() {
    setActiveState(null);
    setZoomed(!zoomed);
    delete document.querySelector("[data-active='true']").dataset.active;

    animateViewBoxScale(0, 0, WIDTH, HEIGHT);
  }

  function zoomToState(stateEl) {
    if (!stateEl.dataset.hasentries) return;
    const state = stateEl.getBoundingClientRect();
    const _svg = stateEl.closest("svg") || stateEl;
    const svg = _svg.getBoundingClientRect();

    const stateRelative = {
      width: (state.width / svg.width) * WIDTH,
      height: (state.height / svg.height) * HEIGHT,
      x: ((state.left - svg.left) / svg.width) * WIDTH,
      y: ((state.top - svg.top) / svg.height) * HEIGHT,
    };
    //if (!stateEl.hasAttribute("d")) return;

    setActiveState(stateEl.dataset.country);

    stateEl.dataset.active = "true";

    setZoomed(!zoomed);

    //starts the viewBox size
    const orientation = getOrientation(
      width,
      height,
      stateRelative.width,
      stateRelative.height
    );

    //readjust to allow card to fit
    const viewPort = {};
    //if its mobile position the country in the middle of viewport else
    //position it the right for the card to go be side it

    function setViewBoxWidthSize() {
      let width;
      if (!isMobile) {
        width = stateRelative.width * 2;
      } else {
        width = stateRelative.width;
      }
      return width;
    }
    function setViewBoxHeightSize() {
      let height;
      if (!isMobile) {
        height = stateRelative.height * 2;
      } else {
        height = stateRelative.height;
      }
      return height;
    }
    function setViewBoxXPos() {
      let x;
      if (!isMobile) {
        x = stateRelative.x - (viewPort.width - stateRelative.width);
        x = x + (viewPort.width / 2 - stateRelative.width) / 2;
      } else {
        x = stateRelative.x - (viewPort.width - stateRelative.width) / 2;
      }

      return x;
    }

    viewPort.width = setViewBoxWidthSize();
    viewPort.height = setViewBoxHeightSize();
    let measurementBasedOnRatio;
    if (orientation === width) {
      viewPort.height = getRatio(height, width, viewPort.width);
      measurementBasedOnRatio = viewPort.height;
    } else {
      viewPort.width = getRatio(width, height, viewPort.height);
      measurementBasedOnRatio = viewPort.width;
    }

    if (measurementBasedOnRatio < stateRelative.height) {
      const offBy = stateRelative.height - measurementBasedOnRatio;
      viewPort.height = offBy + measurementBasedOnRatio;
      viewPort.width = getRatio(width, height, viewPort.height);
    }

    //start viewBox Position
    viewPort.x = setViewBoxXPos();
    viewPort.y = stateRelative.y - (viewPort.height - stateRelative.height) / 2;

    animateViewBoxScale(
      viewPort.x,
      viewPort.y,
      viewPort.width,
      viewPort.height
    );
  }

  const focusInOut = (e) => {
    let stateEl = e.target;

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
      zoomToState(stateEl);
    } else {
      zoomOut();
    }
  };
  return {
    viewBox,
    focusInOut,
    activeState,
    zoomOut,
    zoomed,
    zoomToState,
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
