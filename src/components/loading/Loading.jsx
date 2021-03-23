import React from "react";
import Styles from "./Loading.module.css";

export default function Loading() {
  return (
    <span>
      <div className={Styles.bar}>
        <div className={Styles.in}></div>
      </div>
    </span>
  );
}
