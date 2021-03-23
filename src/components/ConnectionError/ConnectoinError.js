import React from "react";
import Lottie from "react-lottie";
import _404 from "../../data/svg/connection-error.json";

export default function ConnectionError(props) {
  document.title = "Connection Error";

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
      <h1 className={"mainText"}>"Connection Error"</h1>
      <div
        className={"ErrorBtn"}
        onClick={() => {
          if (typeof props.retry === "function") {
            return props.retry();
          }
          window.location.reload();
        }}
      >
        Retry
      </div>
    </div>
  );
}
