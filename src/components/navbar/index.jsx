import React, { Component } from "react";
import firebase from "../../functions/config/fbConfig";
import { Link, Route, Switch } from "react-router-dom";
import Styles from "./navbar.module.css";

import {
  I_SEARCH,
  I_USER_FILL,
  I_USER_OUTLINE,
  I_SETTINGS,
  I_BACK_ARROW,
} from "../../data/svg/svg";
import cssClass from "../../functions/extra/cssClass";

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      userPOP: false,
      currentUser: false,
      showBack:false
    };
  }
  componentDidMount() {
    this.authEvent = () => {};
    this.unlisten = this.props.history.listen((location, action) => {
      if (window.location.pathname !== "/_verify")
        if (firebase.auth().currentUser) {
          if (!firebase.auth().currentUser.emailVerified) {
            this.props.history.push("/_verify");
          }
        }
    });
    window.addEventListener("click", () => {
      if (!this.state.userPOP) return;
      this.setState({ userPOP: false });
    });
    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("locationchange"));
    });
    window.addEventListener("locationchange", () => {
      if (firebase.auth().currentUser) {
        if (!firebase.auth().currentUser.emailVerified) {
          this.props.history.push("/_verify");
        }
      }
      if (!this.state.userPOP) return;
      this.setState({ userPOP: false });
    });
    firebase.auth().onAuthStateChanged((e) => {
      this.setState({ currentUser: firebase.auth().currentUser });
      if (firebase.auth().currentUser) {
        if (!firebase.auth().currentUser.emailVerified) {
          this.props.history.push("/_verify");
        }
      }
    });
    this.lChangeT = () => {
      //location change trigger
      this.setState({ userPOP: false });
      //window.dispatchEvent(new Event("locationchange"));
    };
  }
  render() {
    return (
      <header>
        <nav>
          <div className={Styles.navbar}>
            <div className={cssClass(Styles.back_btn,this.state.showBack?Styles.back_btn_show:"")} role="button">
              <I_BACK_ARROW />
            </div>
            <Link to="/" className={Styles._logo_}>
              <div
                className={Styles.logo}
                style={{
                  backgroundImage: `url(${
                    require("../../data/img/logo-movie-sh.png").default
                  })`,
                }}
              ></div>
              Movie
            </Link>

            <Link to="/watchlist">
              <div className={Styles.nav_button}>Watchlist</div>
            </Link>
            <Link to="settings">
              <div className={Styles.nav_button}>Settings</div>
            </Link>

            <Switch>
              <Route exact path="/search">
                <div style={{ marginRight: "auto" }}></div>
              </Route>
              <Route path="/">
                <div className={Styles.searchbar}>
                  <Link to="/search" className={Styles.searchBtn}>
                    <div className={Styles.searchIcon}>
                      <I_SEARCH h={20} w={20} />
                    </div>
                  </Link>
                </div>
              </Route>
            </Switch>
            <div
              className={cssClass(
                Styles.userIcon,
                this.state.userPOP ? Styles.active : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ userPOP: !this.state.userPOP });
              }}
            >
              <I_USER_OUTLINE />
            </div>
          </div>
        </nav>
        {this.state.userPOP ? (
          <div
            className={Styles.userPOP_con}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={Styles.toolbar}>
              <div className={Styles.p_settings}>
                <Link to="/settings" onClick={this.lChangeT}>
                  <I_SETTINGS />
                </Link>
                <div className="_tooltip">Settings</div>
              </div>
            </div>
            {!this.state.currentUser ? (
              //user not signed
              <div>
                <div className={Styles.popup_con}>
                  <div className={Styles.p_userIcon}>
                    <I_USER_FILL />
                  </div>
                  <h1 className={Styles.popup_title}>
                    Login or Create Account
                  </h1>
                  <div className={Styles.buttons}>
                    <div className={Styles.button}>
                      <Link to="/login" onClick={this.lChangeT}>
                        Login
                      </Link>
                    </div>
                    <div className={Styles.button}>
                      <Link to="/signup" onClick={this.lChangeT}>
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              //user signed
              <div className={Styles.signed}>
                <div className={Styles.avatar_con}>
                  <img
                    alt="avatar"
                    className="avatar"
                    src={
                      firebase.auth().currentUser.photoURL ||
                      require("../../data/img/icon_user.png").default
                    }
                  />
                </div>
                <h2 className={Styles.name}>
                  {firebase.auth().currentUser.displayName || "No Name"}
                </h2>
                <h4 className={Styles.email}>
                  {firebase.auth().currentUser.email || "No Email"}
                </h4>
                <div className={Styles.pro_sett}>
                  <Link to="/settings/profile" onClick={this.lChangeT}>
                    Manage your Profile
                  </Link>
                </div>
                <div className={Styles.hr} />
                <div
                  className={cssClass(Styles.button, Styles.sign_out)}
                  onClick={() => {
                    firebase.auth().signOut();
                  }}
                >
                  Sign out
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </header>
    );
  }
}
export default Navbar;
