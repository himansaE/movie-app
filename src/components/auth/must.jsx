import React from "react";
import { I_USER_FILL } from "../../data/svg/svg";
import Style from "./auth.module.css";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
function MustSign(props) {
  return (
    <div style={{ padding: "22px", overflow: "auto" }}>
      <h1 className={Style.must_head}>You must Login to use this service</h1>
      <div className={Style.must_Icon}>
        <I_USER_FILL />
      </div>
      <div className={Style.must_btn_con}>
        <Link
          to={{
            pathname: "/login",
            state: {
              curr_path: props.history.location.pathname,
            },
          }}
        >
          Login
        </Link>

        <Link
          to={{
            pathname: "/signup",
            state: {
              curr_path: props.history.location.pathname,
            },
          }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default withRouter(MustSign);
