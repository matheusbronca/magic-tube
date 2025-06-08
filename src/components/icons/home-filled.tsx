import * as React from "react";
import { SVGProps } from "react";
const HomeFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
    viewBox="0 0 20 21"
    {...props}
  >
    <path
      d="M3 10c0-.589.26-1.148.709-1.528l7-5.999a2.007 2.007 0 0 1 2.582 0l7 5.999c.449.38.709.939.709 1.528v9c0 1.097-.903 2-2 2H5c-1.097 0-2-.903-2-2v-9Z"
      style={{
        fillRule: "nonzero",
        stroke: "#000",
        strokeWidth: 1,
      }}
      transform="translate(-2 -1.002)"
    />
    <path
      d="M15 21v-8c0-.549-.451-1-1-1h-4c-.549 0-1 .451-1 1v8"
      style={{
        fill: "black",
        fillRule: "nonzero",
        stroke: "#fff",
        strokeWidth: 1.5,
        strokeLinecap: "butt",
      }}
      transform="matrix(1 0 0 .88994 -2 .318)"
    />
  </svg>
);
export default HomeFilledIcon;
