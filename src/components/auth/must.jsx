import React from "react";
import { I_USER_FILL } from "../../data/svg/svg";
import Style from "./auth.module.css";
export default function MustSign() {
  return (
    <div style={{ padding: "22px", overflow: "auto" }}>
      <h1 className={Style.must_head}>You must Login to use this service</h1>
      <div className={Style.must_Icon}>
        <I_USER_FILL />
      </div>
      <div className={Style.must_btn_con}>
        <a href={"/login"}>Login</a>
        <a href={"/signup"}>Signup</a>
      </div>
    </div>
  );
}
