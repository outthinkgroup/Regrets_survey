import React from "react";
import { useNotification } from "../context";

export function ShareButton({ url, text, title }) {
  if (typeof window === "undefined" || !hasNativeShare()) return null;
  return (
    <button
      className="share"
      onClick={() => navigator.share({ url, text, title })}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NativeShareIcon width="1em" strokewidth={3} />
    </button>
  );
}
export function CopyButton({ text, showIcon = true, copyString }) {
  const { dismissAfter, create } = useNotification();

  if (typeof window === "undefined") return null;
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
      className="share"
      onClick={() => {
        copyToClipboard(copyString);
        const id = create({
          type: "INFO",
          message: "Copied link to clipboard",
        });
        dismissAfter(id, 3000);
      }}
    >
      {text}
      {showIcon && <CopyIcon width="1em" strokewidth={8} height="1em" />}
    </button>
  );
}
function copyToClipboard(url) {
  const input = document.createElement("input");
  input.value = url;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export function hasNativeShare() {
  return "share" in navigator;
}

function NativeShareIcon(props) {
  const fill = props.fill || "currentColor";
  const secondaryfill = props.secondaryfill || fill;
  const strokewidth = props.strokewidth || 1;
  const width = props.width || "100%";
  const height = props.height || "100%";

  return (
    <svg
      height={height}
      width={width}
      version="1.1"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      xmlSpace="preserve"
    >
      <g
        fill={secondaryfill}
        stroke={secondaryfill}
        strokeLinecap="square"
        strokeWidth={strokewidth}
      >
        <polyline fill="none" points=" 2,16 2,22 22,22 22,16 " />
        <line
          fill="none"
          stroke={fill}
          strokeLinecap="butt"
          x1="12"
          x2="12"
          y1="17"
          y2="2"
        />
        <polyline fill="none" points="18,8 12,2 6,8 " stroke={fill} />
      </g>
    </svg>
  );
}

function CopyIcon(props) {
  const fill = props.fill || "currentColor";
  const secondaryfill = props.secondaryfill || fill;
  const strokewidth = props.strokewidth || 1;
  const width = props.width || "100%";
  const height = props.height || "100%";

  return (
    <svg
      height={height}
      width={width}
      version="1.1"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      xmlSpace="preserve"
    >
      <g
        fill={secondaryfill}
        stroke={secondaryfill}
        strokeLinecap="square"
        strokeWidth={strokewidth}
        transform="translate(0.5 0.5)"
      >
        <path
          d=" M34.828,29.172c4.686,4.686,4.686,12.284,0,16.971l-7.071,7.071c-4.686,4.686-12.284,4.686-16.971,0l0,0 c-4.686-4.686-4.686-12.284,0-16.971l5.657-5.657"
          fill="none"
        />
        <path
          d="M47.556,33.414l5.657-5.657 c4.686-4.686,4.686-12.284,0-16.971l0,0c-4.686-4.686-12.284-4.686-16.971,0l-7.071,7.071c-4.686,4.686-4.686,12.284,0,16.971"
          fill="none"
          stroke={fill}
        />
      </g>
    </svg>
  );
}
