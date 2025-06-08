import * as React from "react";
import { SVGProps } from "react";
const PlaySquareFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
      style={{
        stroke: "#000",
        strokeWidth: 1,
      }}
      transform="translate(-2 -2)"
    />
    <path
      d="m9 8 6 4-6 4V8Z"
      style={{
        fill: "#fff",
        fillRule: "nonzero",
        stroke: "#fff",
        strokeWidth: 0,
      }}
      transform="translate(-2 -2)"
    />
  </svg>
);
export default PlaySquareFilledIcon;
