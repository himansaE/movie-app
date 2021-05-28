import firebase from "../../functions/config/fbConfig";
import React, { Component } from "react";
import { getWatchlist } from "../../functions/requests/FBReq";
import MustSign from "../auth/must";
import { get_movie_details } from "../../functions/requests";
import Loader from "../../data/svg/loader";
import MStyle from "../main/main.module.css";
import { Result } from "../search";
import axios from "axios";
import Lottie from "react-lottie";
import EmptyAnim from "../../data/svg/16656-empty-state.json";
import { Link } from "react-router-dom";
import ConnectionError from "../ConnectionError/ConnectoinError";

export default class Watchlist extends Component {
  constructor() {
    super();
    this.state = {
      user: false,
      Watchlist: false,
      error: false,
    };
    this.list = [];
  }
  componentDidMount() {
    this.axiosToken = axios.CancelToken.source();
    this.userEvent = firebase.auth().onAuthStateChanged(() => {
      this.data_get();
    });
  }
  data_get = () => {
    if (firebase.auth().currentUser !== null) {
      this.setState({ user: true, Watchlist: false });
      getWatchlist()
        .then((r) => {
          if (r.length === 0) return this.setState({ Watchlist: [] });
          r.forEach((e) => {
            get_movie_details({ id: e, cancelT: this.axiosToken })
              .then((d) => {
                if (typeof this.state.Watchlist === "boolean")
                  return this.setState({ Watchlist: [d] });
                else
                  return this.setState({
                    Watchlist: [...this.state.Watchlist, d],
                  });
              })
              .catch(() => this.setState({ error: true, Watchlist: true }));
          });
        })
        .catch(() => {
          this.setState({ error: true, Watchlist: true });
        });
    } else this.setState({ user: false });
  };
  componentWillUnmount() {
    this.axiosToken.cancel();
    this.userEvent();
  }
  render() {
    return (
      <div style={{ overflow: "auto" }}>
        {this.state.user ? (
          <>
            {this.state.Watchlist === false ? (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loader />
              </div>
            ) : this.state.error ? (
              <ConnectionError retry={this.data_get} />
            ) : (
              <div style={{ padding: "15px 10px" }}>
                <h1 className={MStyle.title_name}>Watchlist</h1>
                {this.state.Watchlist.length === 0 ? (
                  <EmptyList />
                ) : (
                  this.state.Watchlist.map((r) => (
                    <Result
                      key={r.id}
                      title={r.title}
                      img={r.medium_cover_image}
                      id={r.id}
                      mpa_rating={r.mpa_rating}
                      rating={r.rating}
                    />
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <div>
            <MustSign />
          </div>
        )}
      </div>
    );
  }
}
function EmptyList() {
  return (
    <div>
      <Lottie
        options={{
          animationData: EmptyAnim,
          autoplay: true,
          loop: true,
        }}
        isClickToPauseDisabled={true}
        height={"250px"}
        width={"250px"}
      />
      <p className={MStyle.wl_text}>Your Watchlist is Empty</p>
      <div className={MStyle.wl_btn_con}>
        <Link to="/">Browse Movies</Link>
      </div>
    </div>
  );
}
