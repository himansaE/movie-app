import React from "react";
import Lottie from "react-lottie";
import _404 from "../../data/svg/31313-spaceman-404.json";

export default function Error404() {
  document.title = "404 - Page not Found";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Lottie
        options={{
          animationData: _404,
          autoplay: true,
          loop: true,
        }}
        isClickToPauseDisabled={true}
        height={"250px"}
        width={"250px"}
      />
      <h1 style={{ color: "var(--text-color-dim)" }}>"Page Not Found"</h1>
    </div>
  );
}
