import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import { FBAnalytics } from "../../functions/config/fbConfig";
import Loader from "../../data/svg/loader";
import { get_chunk_results } from "../../functions/requests";
import ConnectionError from "../ConnectionError/ConnectoinError"; //connection
import Error404 from "../404/Error404";
import { I_ALERT, I_STAR } from "../../data/svg/svg";
import Styles from "../main/main.module.css";

export default class List extends Component {
  loader = createRef();
  container = createRef();
  mainLoader = createRef();
  state = {
    data: undefined,
    page: 1,
    stillNeedToLoad: true,
    onWaiting: false,
    title: "",
    loadError: false,
  };
  pages = [
    { path: "all", param: {}, title: "Browse movies" },
    {
      path: "new-release",
      param: { sort_by: "year" },
      title: "New Released Movies",
    },
    {
      path: "top-rated",
      param: { sort_by: "rating" },
      title: "Top Rated Movies",
    },
    {
      path: "downloaded",
      param: { sort_by: "download_count" },
      title: "Most Downloaded Movies",
    },
  ];
  componentDidMount() {
    //decide about url ...
    this.param = this.pages.filter(
      (i) => i.path === this.props.match.params.data
    );
    if (this.param.length === 0) return this.setState({ data: "404" });
    this.setState({ title: this.param[0].title }, () => {
      document.title = this.state.title;
      FBAnalytics("full-list");
      get_chunk_results(this.param[0].param).then((r) =>
        this.setState(
          {
            data: r.data,
            page: r.page_number,
            stillNeedToLoad: true,
            onWaiting: false,
          },
          () => {
            if (r.page_number * 20 < r.movie_count) {
              this.observer.observe(this.loader.current);
            }
          }
        )
      );
      this.observer = new IntersectionObserver(this.observe_f, {
        root: this.container.current,
        rootMargin: "0px",
        threshold: 1.0,
      });
    });
  }
  removeDup = (array = []) => {
    return array.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  };
  observe_f = (e) => {
    if (this.state.stillNeedToLoad && !this.state.onWaiting) {
      this.setState({ onWaiting: true });
      get_chunk_results({
        ...this.param[0].param,
        page: this.state.page + 1,
      }).then((r) => {
        if (r.name === "Error") {
          return this.setState({ loadError: true, onWaiting: false });
        }
        this.setState(
          {
            data: this.removeDup([...this.state.data, ...r.data]),
            page: r.page_number,
            stillNeedToLoad: r.page_number * 20 < r.movie_count,
            onWaiting: false,
          },
          () => {
            if (r.page_number * 20 < r.movie_count) {
              this.observer.observe(this.loader.current);
            }
          }
        );
      });
    }
  };
  render() {
    if (this.state.data === undefined)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          ref={this.mainLoader}
        >
          <Loader />
        </div>
      );
    if (this.state.data === false) return <ConnectionError />;
    if (this.state.data === "404") return <Error404 />;
    return (
      <div style={{ overflowY: "auto" }} ref={this.container}>
        <h1 className={Styles.title_name}>{this.state.title}</h1>
        <div className={Styles.Ml_con}>
          {this.state.data.map((i, n) => {
            return (
              <div key={n} className={Styles.card}>
                <Link
                  to={
                    //todo :: change to imdb id
                    `/movie/${i.id}`
                  }
                >
                  <div className={Styles.card_image_con}>
                    <img
                      alt=""
                      src={i.medium_cover_image}
                      className={Styles.card_image}
                      onError={(e) => {
                        e.target.src = require("../../data/img/empty.png").default;
                        e.target.style.backgroundImage = `url(${
                          require("../../data/img/icon-movie-64.png").default
                        })`;
                      }}
                    />
                    <div className={Styles.card_data_con}>
                      <div className={Styles.card_rating}>
                        <I_STAR />
                        {i.rating}
                      </div>
                    </div>
                  </div>
                  <div className={Styles.name}>{i.title_long}</div>
                </Link>
              </div>
            );
          })}
        </div>
        {this.state.stillNeedToLoad ? (
          <div className={Styles.I_loader}>
            {this.state.loadError ? (
              <div className={Styles.loadError}>
                <div className={Styles.ErrorName}>
                  <I_ALERT h="18" />
                  Connection error
                </div>

                <div
                  className={Styles.reload_btn}
                  onClick={() =>
                    this.setState({ loadError: false }, () => {
                      this.observe_f();
                    })
                  }
                >
                  Reload
                </div>
              </div>
            ) : (
              <div ref={this.loader}>
                <Loader />
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
