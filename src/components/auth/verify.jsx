import React, { Component } from "react";
import firebase from "../../functions/config/fbConfig";
import Lottie from "react-lottie";
import emailSent from "../../data/svg/email-sent.json";
import Styles from "./auth.module.css";
export default class Verify extends Component {
  constructor() {
    super();
    this.state = {
      sendLink: false,
    };
  }
  componentDidMount() {
    this.authEvent = () => {
      if (firebase.auth().currentUser) {
        if (firebase.auth().currentUser.emailVerified) {
          this.props.history.push("/");
        }
      } else {
        this.props.history.push("/");
      }
    };
    this.authEvent();
    firebase.auth().onAuthStateChanged(this.authEvent);
  }
  render() {
    return (
      <div className={Styles._v}>
        <Lottie
          options={{
            animationData: emailSent,
            autoplay: true,
            loop: true,
          }}
          isClickToPauseDisabled={true}
          height={"250px"}
          width={"250px"}
        />
        <h1 className={Styles.v_head}>You need to Verify your Account</h1>
        <div className={Styles.btn_group}>
          <button
            className={Styles.v_btn}
            onClick={() => {
              if (this.state.sendLink) return;
              this.setState({ sendLink: true });
              firebase
                .auth()
                .currentUser.sendEmailVerification()
                .then((r) => {});
            }}
          >
            Send Verify Email Again
          </button>

          <button
            className={Styles.v_btn}
            onClick={() => {
              firebase
                .auth()
                .currentUser.reload()
                .then((e) => {
                  if (firebase.auth().currentUser.emailVerified) {
                    this.props.history.push("/");
                  }
                });
            }}
          >
            Conform Verified
          </button>
        </div>
        {this.state.sendLink ? <h3>Email Sent...</h3> : <></>}
      </div>
    );
  }
}
