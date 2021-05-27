import React, { Component } from "react";
import { Link } from "react-router-dom";
import cssClass from "../../functions/extra/cssClass";
import Styles from "./auth.module.css";
import Loader from "../../data/svg/loader";
import firebase from "../../functions/config/fbConfig";
import { I_CLOSE } from "../../data/svg/svg";
import firebase_code_to_text from "../../functions/extra/firebaseAuthErrorCodes";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      submitted: false,
      email: "",
      password: "",
      error: false,
      error_text: "",
    };
  }

  componentDidMount() {
    this.fbAuthEvent = () => {};
    this.fbAuthEvent = firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        this.props.history.replace(
          this.props.history.location.state?.curr_path ?? "/"
        );
      }
    });
  }
  componentWillUnmount() {
    this.fbAuthEvent();
  }

  render() {
    return (
      <div className={Styles.sign_con}>
        <div className={Styles.box}>
          <h1
            className={cssClass(
              Styles.header,
              !this.state.error ? Styles.big_margin : ""
            )}
          >
            LogIn
          </h1>
          <div className={Styles.form_con}>
            {this.state.error ? (
              <div className={Styles.fake}>
                <div className={Styles.error_text}>{this.state.error_text}</div>
                <div className={Styles.error_close}>
                  <div
                    className={Styles.error_btn}
                    onClick={() => {
                      this.setState({ error: false, error_text: "" });
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
              autoSave="true"
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
              <input
                className={Styles.text_input}
                placeholder={"Password"}
                type="password"
                value={this.state.password}
                autoComplete="current-password"
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
              <div className={Styles.submit_con}>
                <div className={Styles.link}>
                  {this.state.email.trim() === "" ? (
                    <Link to="/signup">Create Account </Link>
                  ) : (
                    <Link to={`/reset?email=${encodeURI(this.state.email)}`}>
                      Forget Password
                    </Link>
                  )}
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
                      .signInWithEmailAndPassword(
                        this.state.email,
                        this.state.password
                      )
                      .then((r) => r)
                      .catch((r) => {
                        console.error(r);
                        this.setState({
                          error: true,
                          error_text: firebase_code_to_text(r.code),
                          submitted: false,
                        });
                      });
                  }}
                >
                  {this.state.submitted ? (
                    <div>
                      <Loader h="20" stroke="var(--background)" />
                    </div>
                  ) : (
                    "Login"
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
