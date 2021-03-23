import React from "react";
import Lottie from "react-lottie";
import _404 from "../../data/svg/28915-website-under-maintenance.json";

export default function Building() {
  document.title = "page under Construction";
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
        height={"350px"}
        width={"350px"}
      />
      <h1 className={"mainText"}>This page is under Construction</h1>
    </div>
  );
}
