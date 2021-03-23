import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../functions/config/fbConfig";
import firebase_code_to_text from "../../functions/extra/firebaseAuthErrorCodes";
import cssClass from "../../functions/extra/cssClass";
import Styles from "./auth.module.css";
import Loader from "../../data/svg/loader";
import { I_CLOSE } from "../../data/svg/svg";
export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      submitted: false,
      email: "",
      password: "",
      error_text: "",
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        this.props.history.push("/");
      }
    });
  }
  render() {
    return (
      <div className={Styles.sign_con}>
        <div className={Styles.box}>
          <h1 className={Styles.header}>Signup</h1>
          <div className={Styles.form_con}>
            {this.state.error_text ? (
              <div className={Styles.fake}>
                <div className={Styles.error_text}>{this.state.error_text}</div>
                <div className={Styles.error_close}>
                  <div
                    className={Styles.error_btn}
                    onClick={() => {
                      this.setState({ error_text: "" });
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
                autoComplete="email"
                value={this.state.email}
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />
              <input
                className={Styles.text_input}
                placeholder={"Password"}
                type="password"
                autoComplete="new-password"
                value={this.state.password}
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
              <div className={Styles.submit_con}>
                <div className={Styles.link}>
                  <Link to="/login">I have an account</Link>
                </div>
                <button
                  type="submit"
                  className={cssClass(
                    Styles.button,
                    this.state.submitted ? Styles.progress : " "
                  )}
                  onClick={() => {
                    // ***SignUp function*** //

                    if (this.state.submitted) return;
                    this.setState({ submitted: true });
                    firebase
                      .auth()
                      .createUserWithEmailAndPassword(
                        this.state.email,
                        this.state.password
                      )
                      .then((r) => {
                        console.log(r);
                      })
                      .catch((e) => {
                        console.error(e);
                        this.setState({
                          error_text: firebase_code_to_text(e.code),
                        });
                      })
                      .finally(() => {
                        this.setState({ submitted: false });
                      });
                  }}
                >
                  {this.state.submitted ? (
                    <div>
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
