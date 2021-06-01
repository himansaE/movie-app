import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { I_MOVIE, I_BOOKMARK, I_SETTINGS } from "../../data/svg/svg";
import Styles from "./navbar.module.css";
import NotificationListener from "./notification-listener";

export default class BottomNav extends Component {
  render() {
    return (
      <>
        <div className={Styles.b_nav_con}>
          <nav className={Styles.b_nav}>
            <NavLink
              to="/"
              exact
              className={Styles.b_item}
              activeClassName={Styles.b_active}
            >
              <I_MOVIE />
              <div className={Styles.b_text}> Home</div>
            </NavLink>
            <NavLink
              to="/watchlist"
              className={Styles.b_item}
              activeClassName={Styles.b_active}
            >
              <I_BOOKMARK />
              <div className={Styles.b_text}> WatchList</div>
            </NavLink>
            <NavLink
              to="/settings"
              className={Styles.b_item}
              activeClassName={Styles.b_active}
            >
              <I_SETTINGS />
              <div className={Styles.b_text}> Settings</div>
            </NavLink>
          </nav>
        </div>
        <div className={Styles.b_nav_fake}></div>

        <NotificationListener />
      </>
    );
  }
}
