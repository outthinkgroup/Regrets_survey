import { useState } from "react";
import { useSpring } from "react-spring";
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

  const focusInOut = (e) => {
    let stateEl = e.target;

    if (e.target.closest("#United_States")) {
      console.log("should be america");
      stateEl = e.target.closest("#United_States");
    }
    //if (!stateEl.dataset.hasentries) return;
    console.log(stateEl);
    const state = stateEl.getBoundingClientRect();
    const _svg = e.target.closest("svg") || e.target;
    const svg = _svg.getBoundingClientRect();

    if (
      e.target.classList.contains("active-state-info-card") ||
      e.target.closest(".active-state-info-card")
    )
      return;

    const stateRelative = {
      width: (state.width / svg.width) * WIDTH,
      height: (state.height / svg.height) * HEIGHT,
      x: ((state.left - svg.left) / svg.width) * WIDTH,
      y: ((state.top - svg.top) / svg.height) * HEIGHT,
    };
    //if (!zoomed) {
    if (!e.target.hasAttribute("d")) return;

    setActiveState(stateEl.id);

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
    viewPort.width = stateRelative.width * 2;
    viewPort.height = stateRelative.height * 2;
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

    //?MAY NOT NEED
    /* const getDistance = (newViewBox) => {
        const distanceWidth = width - newViewBox.width;
        const distanceHeight = height - newViewBox.height;
        return { distanceWidth, distanceHeight };
      }; */
    //end viewBox size

    //start viewBox Position
    viewPort.x = stateRelative.x - (viewPort.width - stateRelative.width);
    viewPort.x = viewPort.x + (viewPort.width / 2 - stateRelative.width) / 2;
    viewPort.y = stateRelative.y - (viewPort.height - stateRelative.height) / 2;

    animateViewBoxScale(
      viewPort.x,
      viewPort.y,
      viewPort.width,
      viewPort.height
    );
    /* } else {
      zoomOut();
    } */
  };
  return {
    viewBox,
    focusInOut,
    activeState,
    zoomOut,
    zoomed,
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

function useReactSpring(el, nextXPos, nextYPos, nextWidth, nextHeight) {
  const currentViewBox = el.viewBox;
}
