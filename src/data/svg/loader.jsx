import React from "react";
import Styles from "./style.module.css";

export default function Loader(props) {
  return (
    <svg
      className={Styles.svg_loader_svg}
      style={{ height: (props.h || 50) + "px" }}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        strokeWidth="5"
        strokeLinecap="round"
        stroke={props.stroke || "rgba(119,119,119,0.767)"}
        className={Styles.svg_loader_circle}
      />
    </svg>
  );
}
