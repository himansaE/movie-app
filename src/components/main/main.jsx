import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FBAnalytics } from "../../functions/config/fbConfig";
import { I_NEXT, I_STAR } from "../../data/svg/svg";
import { get_chunk_results } from "../../functions/requests";
import ConnectionError from "../ConnectionError/ConnectoinError"; //connection
import Styles from "./main.module.css";
export function MovieList(props) {
  if (!props.data) return <></>;
  return (
    <div className={Styles.movie_item}>
      {props.link ? (
        <div style={{ display: "flex" }} className={Styles.url_head}>
          <Link to={props.link}>
            <h1 className={Styles.title}>{props.title}</h1>{" "}
            <div className={Styles.next_icon}>
              <I_NEXT />
            </div>
          </Link>
        </div>
      ) : (
        <h1 className={Styles.title} style={{ margin: "0 35px" }}>
          {props.title}
        </h1>
      )}
      <div
        className={Styles.list}
        style={{ placeContent: props.align ?? "var(--pc)" }}
      >
        {props.data.map((i, n) => {
          return (
            <div key={n} className={Styles.card}>
              <Link
                to={
                  //todo :: change to imdb id
                  `/movie/${i.id}`
                }
                onClick={() => {
                  if (props.trigger) {
                    var event = new CustomEvent("linkXChange", {
                      detail: { id: i.id },
                    });
                    window.dispatchEvent(event);
                  }
                }}
              >
                <div className={Styles.card_image_con}>
                  <img
                    alt=""
                    src={i.medium_cover_image}
                    className={Styles.card_image}
                    loading={props.link ? "lazy" : "eager"}
                    onError={(e) => {
                      e.target.src =
                        require("../../data/img/empty.png").default;
                      e.target.style.backgroundImage = `url(${
                        require("../../data/img/icon-movie-64.png").default
                      })`;
                    }}
                  />
                  <div className={Styles.card_data_con}>
                    <div className={Styles.card_rating}>
                      <I_STAR fill="white" />
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
    </div>
  );
}
export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      loadedData: [],
      pageData: [
        {
          title: "Movies Newly Added",
          data: null,
          params: { limit: 8 },
          loaded: false,
          link: "list/all",
        },
        {
          title: "New Released Movies",
          data: null,
          params: { limit: 10, sort_by: "year" },
          loaded: false,
          link: "list/new-release",
        },
        {
          title: "Top Rated Movies",
          data: null,
          params: { limit: 10, sort_by: "rating" },
          loaded: false,
          link: "list/top-rated",
        },
        {
          title: "Most Downloaded Movies",
          data: null,
          params: { limit: 10, sort_by: "download_count" },
          loaded: false,
          link: "list/downloaded",
        },
      ],
    };
  }
  loadData = () => {
    this.state.pageData.forEach((i, n) => {
      if (!i.loaded) {
        get_chunk_results(i.params)
          .then((r) => {
            this.setState({
              loadedData: [
                ...this.state.loadedData,
                (() => {
                  let x = this.state.pageData[n];
                  x.data = r.data;
                  x.loaded = true;
                  return x;
                })(),
              ],
              error: false,
            });
          })
          .catch((r) => this.setState({ error: true }));
      }
    });
    document.title = "Download Movies!";
    FBAnalytics("HOME");
  };
  componentDidMount() {
    this.loadData();
  }
  render() {
    if (this.state.error) return <ConnectionError retry={this.loadData} />;
    return (
      <div className={Styles.main} tabIndex="-1">
        {this.state.loadedData.map((i) => {
          return (
            <MovieList
              title={i.title}
              data={i.data}
              key={i.title}
              link={i.link}
            />
          );
        })}
      </div>
    );
  }
}
