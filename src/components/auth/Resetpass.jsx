import firebase from "../../functions/config/fbConfig";
import React, { Component } from "react";
import Styles from "./auth.module.css";
import { Link } from "react-router-dom";
import cssClass from "../../functions/extra/cssClass";
import Loader from "../../data/svg/loader";
import { I_CLOSE } from "../../data/svg/svg";
import firebase_code_to_text from "../../functions/extra/firebaseAuthErrorCodes";

export default class ResetPass extends Component {
  constructor() {
    super();
    if (firebase.auth().currentUser !== null) window.location.pathname = "/";
    this.state = {
      error: false,
      email: "",
      submitted: false,
      success: false,
    };
  }
  componentDidMount() {
    this.setState({
      email: new URLSearchParams(this.props.location.search).get("email"),
    });
    this.fbEVENT = firebase.auth().onAuthStateChanged((e) => {
      if (firebase.auth().currentUser !== null) window.location.pathname = "/";
    });
  }
  componentWillUnmount() {
    this.fbEVENT();
  }

  render() {
    return (
      <div className={Styles.sign_con}>
        <div className={Styles.box}>
          <h1 className={Styles.header}> Password Reset</h1>
          <p className={Styles.head_txt}>Enter Email to Reset password</p>
          <div className={Styles.form_con}>
            {this.state.error || this.state.success ? (
              <div
                className={Styles.fake}
                style={{ backgroundColor: this.state.success ? "#7b7b7b" : "" }}
              >
                <div className={Styles.error_text}>{this.state.error_text}</div>
                <div className={Styles.error_close}>
                  <div
                    className={Styles.error_btn}
                    onClick={() => {
                      this.setState({ success: false, error: false });
                    }}
                  >
                    <I_CLOSE fill="#212121" />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className={Styles.form}
              autoComplete="true"
              autoCapitalize="no"
              autoCorrect="no"
              autoSave="no"
            >
              <input
                className={Styles.text_input}
                placeholder={"E-mail"}
                value={this.state.email}
                autoComplete="email"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />

              <div className={Styles.submit_con}>
                <div className={Styles.link}>
                  <Link to="/login">Login instead </Link>
                </div>
                <button
                  type="submit"
                  className={cssClass(
                    Styles.button,
                    this.state.submitted ? Styles.progress : " "
                  )}
                  onClick={() => {
                    //submit function
                    if (this.state.submitted) return;
                    this.setState({ submitted: true });
                    firebase
                      .auth()
                      .sendPasswordResetEmail(this.state.email)
                      .then((r) => {
                        this.setState({
                          success: true,
                          error_text: "Password reset Email send successfully.",
                          submitted: false,
                        });
                      })
                      .catch((r) =>
                        this.setState({
                          error_text: firebase_code_to_text(r.code),
                          error: true,
                          success: false,
                          submitted: false,
                        })
                      );
                  }}
                >
                  {this.state.submitted ? (
                    <div style={{ display: "flex" }}>
                      <Loader h="20" stroke="var(--background)" />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
