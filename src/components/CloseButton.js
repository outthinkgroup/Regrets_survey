import React from "react";
import Icon from "./Icon.js";
export default function CloseButton(closeFn) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        closeFn();
      }}
      className="close"
    >
      <Icon name="close" color="black" />
    </button>
  );
}
