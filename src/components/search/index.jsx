import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import { FBAnalytics } from "../../functions/config/fbConfig";
import Styles from "./style.module.css";
import Lottie from "react-lottie";
import { get_hint, get_results } from "../../functions/requests/index";
import Loader from "../../data/svg/loader";
import {
  I_SEARCH,
  I_STAR,
  I_DOWN,
  I_FILTER,
  I_SORT,
  I_HQ,
  I_ASC,
  I_CLIPBOARD,
  I_ALERT,
} from "../../data/svg/svg";
import { Select } from "../input/index";
import CANT_FIND from "../../data/svg/cant-find.json";
import CONNECTION_ERROR from "../../data/svg/connection-error-in-search.json";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      hint: [],
      box_focus: false,
      page: undefined,
      result: [],
      count: undefined,
      still_loading: false,
      filter: false,
      error: false,
      after_err: false,
      root_loading: false,
      clipboard: false,
    };
    this.q = {
      query_term: "",
      minimum_rating: "",
      genre: "",
      sort_by: "",
      order_by: "",
      quality: "",
    };

    this.filters = {};
    this.loader = createRef();
    this.top_node = createRef();
    this.genre = createRef();
    this.sort = createRef();
    this.quality = createRef();
    this.rate = createRef();
    this.asc = createRef();
  }
  getParm = (parm) => {
    return new URL(window.location).searchParams.get(parm) || "";
  };
  clipboardChange = () => {
    if (navigator.clipboard && document.hasFocus()) {
      navigator.clipboard.readText().then((r) => {
        if (r.length < 60 && r.trim !== "" && this.state.value !== r) {
          this.setState({ clipboard: r });
          console.log(
            "%c clipboard ",
            "background-color: #2d2a63; border-radius:3px;margin-right:6px",
            r
          );
        }
      });
    }
  };
  observer_f = (e) => {
    this.setState({ still_loading: true, after_err: false });
    let dd = Object.assign(this.q, { page: this.state.page + 1 });

    get_results(dd)
      .then((r) => {
        this.setState({
          result: this.removeDup([...this.state.result, ...r.movies]),
          count: r.movie_count,
          page: r.page_number,
          still_loading: false,
        });
      })
      .catch(() => {
        this.setState({ after_err: true, still_loading: false });
      });
  };
  componentDidMount() {
    FBAnalytics("search");
    var query = this.getParm("query_term");
    this.setState({ value: query });
    if (query) {
      this.setState({ value: query });
      this.q = {
        query_term: query,
        minimum_rating: this.getParm("minimum_rating"),
        genre: this.getParm("genre"),
        sort_by: this.getParm("sort_by"),
        order_by: this.getParm("order_by"),
        quality: this.getParm("quality"),
      };
      this.searchIt();
    }
    window.addEventListener("popstate", this.changeLocation);
    let options = {
      root: this.top_node.current,
      rootMargin: "0px",
      threshold: 1.0,
    };
    this.clipboardChange();
    window.addEventListener("focus", this.clipboardChange);

    this.observer = new IntersectionObserver((e) => {
      if (
        !this.state.still_loading &&
        e[0].intersectionRatio === 1 &&
        this.state.page * 20 < this.state.count
      ) {
        this.observer_f(e);
      }
    }, options);
  }
  componentWillUnmount() {
    window.removeEventListener("popstate", this.changeLocation);
    window.removeEventListener("focus", this.clipboardChange);
  }
  changeLocation = (e) => {
    var query = this.getParm("query_term");
    if (query === "")
      this.setState({
        hint: [],
        box_focus: false,
        page: 1,
        result: [],
        count: undefined,
        still_loading: false,
        filter: false,
        error: false,
        root_loading: false,
      });
    this.setState({ value: query });
    if (query) {
      this.setState({ value: query });
      this.q = {
        query_term: query,
        minimum_rating: this.getParm("minimum_rating"),
        genre: this.getParm("genre"),
        sort_by: this.getParm("sort_by"),
        order_by: this.getParm("order_by"),
        quality: this.getParm("quality"),
      };
      this.setState({
        hint: [],
        box_focus: false,
        page: 1,
        result: [],
        count: undefined,
        still_loading: false,
        filter: false,
        error: false,
        root_loading: false,
      });
      this.searchIt();
    }
  };
  removeDup = (array = []) => {
    return array.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  };
  observe = () => {
    if (
      this.state.page * 20 < this.state.count &&
      this.state.count !== undefined
    ) {
      this.observer.observe(this.loader.current);
    }
  };
  changeValue = (e) => {
    this.setState({ value: e.target.value });
    if (!e.target.value.trim()) {
      this.setState({ hint: [] });
    } else {
      get_hint(e.target.value).then((r) => {
        if (r) {
          this.setState({ hint: r });
        }
      });
    }
  };
  KeyDown = (e) => {
    if (e.keyCode !== 13) return;
    if (this.state.value.trim() === "") return;
    e.target.blur();
    this.q.query_term = this.state.value;
    this.searchIt();
    this.props.history.push({
      pathname: "/search",
      search: Object.entries(this.q)
        .map(
          ([key, val]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
        )
        .join("&"),
    });
  };

  searchIt = () => {
    this.setState({
      hint: [],
      result: [],
      count: undefined,
      error: false,
      root_loading: true,
      page: 1,
    });
    this.q.page = 1;

    get_results(this.q)
      .then((r) => {
        if (r.movie_count === 0) {
          this.setState({
            result: [],
            count: 0,
            page: undefined,
            root_loading: false,
          });
          return;
        }
        this.setState({
          result: Array.isArray(r.movies) ? this.removeDup(r.movies) : [],
          count: r.movie_count,
          page: r.page_number,
          root_loading: false,
        });
        this.observe();
      })
      .catch(() => this.setState({ error: true, root_loading: false }));
  };

  render() {
    return (
      <section className={Styles.section} ref={this.top_node}>
        <Helmet title="Search Movie"></Helmet>
        <div className={Styles.container}>
          <div
            className={
              Styles.input_con +
              " " +
              (this.state.hint.length > 0 &&
              this.state.box_focus &&
              this.state.value.trim().length > 0
                ? Styles.with_hint
                : "")
            }
          >
            <div className={Styles.fakeInput} />
            <div className={Styles.input_wrapper}>
              <div className={Styles.input_icon}>
                <I_SEARCH h="22" fill="#757575eb" />
              </div>
              <input
                aria-live="polite"
                placeholder="Search "
                value={this.state.value}
                onChange={this.changeValue}
                onKeyDown={this.KeyDown}
                autoFocus={true}
                onFocus={() => {
                  this.setState({ box_focus: true });
                }}
                onBlur={() => {
                  this.setState({ box_focus: false });
                }}
              />
              <ul className={Styles.hint_con} role="listbox">
                <div className={Styles.hr} />
                {this.state.hint.map((i, n) => (
                  <Hinter
                    key={n}
                    title={i.title}
                    pic={i.pic_path}
                    year={i.year}
                    selected={n === 0}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div
            className={
              Styles.filter_con + " " + (this.state.filter ? Styles.expand : "")
            }
          >
            <div className={Styles.filter_head}>
              <div className={Styles.filter_head_text}> Filter Result</div>
              <div
                className={Styles.down_icon}
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => {
                  if (this.state.filter) {
                    this.setState({ filter: false });
                  } else {
                    this.setState({ filter: true });
                  }
                }}
              >
                <div className={Styles.filter_icon}>
                  <I_DOWN fill="#929292" />
                </div>
              </div>
            </div>

            <div className={Styles.filter_body}>
              <div className={Styles.item}>
                <div className={Styles.r_title}>Genre</div>
                <Select
                  ref={this.genre}
                  icon={I_FILTER}
                  val={this.q.genre}
                  options={[
                    "all",
                    "action",
                    "adventure",
                    "animation",
                    "biography",
                    "comedy",
                    "crime",
                    "documentary",
                    "drama",
                    "family",
                    "fantasy",
                    "film-noir",
                    "game-show",
                    "history",
                    "horror",
                    "music",
                    "musical",
                    "mystery",
                    "news",
                    "reality-tv",
                    "romance",
                    "sci-fi",
                    "sport",
                    "talk-show",
                    "thriller",
                    "war",
                    "western",
                  ]}
                />
              </div>
              <div className={Styles.result_item}>
                <div className={Styles.r_title}>Sort By</div>
                <Select
                  search={false}
                  ref={this.sort}
                  icon={I_SORT}
                  val={this.q.sort_by}
                  options={[
                    "title",
                    "year",
                    "rating",
                    "peers",
                    "seeds",
                    "download_count",
                    "like_count",
                    "date_added",
                  ]}
                />
              </div>
              <div className={Styles.result_item}>
                <div className={Styles.r_title}>Quality</div>
                <Select
                  search={false}
                  ref={this.quality}
                  icon={I_HQ}
                  options={["All", "720p", "1080p", "2160p", "3D"]}
                  val={this.q.quality}
                />
              </div>
              <div className={Styles.result_item}>
                <div className={Styles.r_title}>Order By</div>
                <Select
                  search={false}
                  ref={this.asc}
                  icon={I_ASC}
                  options={["desc", "asc"].reverse()}
                  val={this.q.order_by}
                />
              </div>
              <div className={Styles.result_item}>
                <div className={Styles.r_title}>Minimum Rating</div>
                <Select
                  ref={this.rate}
                  search={false}
                  icon={I_STAR}
                  val={this.q.minimum_rating}
                  options={[...Array.from({ length: 10 }, (v, k) => k)]}
                />
              </div>
            </div>
            <div className={Styles.reset_con}>
              <div
                className={Styles.reset}
                onClick={() => {
                  var evt = new CustomEvent("form_reset", {
                    detail: "Any Object Here",
                  });
                  window.dispatchEvent(evt);
                  this.q.minimum_rating = "";
                  this.q.sort_by = "";
                  this.q.genre = "";
                  this.q.quality = "";
                  this.q.order_by = "";
                  this.setState({ page: 1 });
                }}
              >
                Reset
              </div>
              <div
                className={Styles.filter_btn}
                onClick={() => {
                  this.q.minimum_rating = this.rate.current.state.value;
                  this.q.sort_by = this.sort.current.state.value;
                  this.q.genre = this.genre.current.state.value;
                  this.q.quality = this.quality.current.state.value;
                  this.q.order_by = this.asc.current.state.value;
                  if (this.q.query_term.trim()) {
                    this.searchIt();
                    this.props.history.push({
                      pathname: "/search",
                      search: Object.entries(this.q)
                        .map(
                          ([key, val]) =>
                            `${encodeURIComponent(key)}=${encodeURIComponent(
                              val
                            )}`
                        )
                        .join("&"),
                    });
                  }
                }}
              >
                Filter
              </div>
            </div>
          </div>
          {this.state.clipboard !== false ? (
            <div className={Styles.clipboard_con}>
              <div
                className={Styles.clipboard}
                onClick={() => {
                  this.q.query_term = this.state.clipboard;
                  this.searchIt();
                  this.setState({
                    value: this.state.clipboard,
                    clipboard: false,
                  });
                  this.props.history.push(
                    `/search?query_term=${encodeURI(this.state.clipboard)}`
                  );
                }}
              >
                <I_CLIPBOARD w="19" />
                <div className={Styles.clipboard_t}>{this.state.clipboard}</div>
              </div>
            </div>
          ) : undefined}

          {this.state.root_loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "55px",
              }}
            >
              <Loader />
            </div>
          ) : (
            ""
          )}
          <div className={Styles.results}>
            <div className={Styles.result_grid}>
              {this.state.result.map((i, n) => (
                <Result
                  key={n}
                  title={i.title_long}
                  img={i.small_cover_image}
                  rating={i.rating}
                  mpa_rating={i.mpa_rating}
                  id={i.id}
                />
              ))}
            </div>
            {this.state.error ? (
              <div>
                <Lottie
                  options={{
                    animationData: CONNECTION_ERROR,
                    autoplay: true,
                    loop: true,
                  }}
                  isClickToPauseDisabled={true}
                  height={"250px"}
                  width={"250px"}
                />
                <h1 style={{ textAlign: "center" }}>"Something Went Wrong"</h1>
              </div>
            ) : (
              <div />
            )}
            {this.state.count === 0 ? (
              <div>
                <Lottie
                  options={{
                    animationData: CANT_FIND,
                    autoplay: true,
                    loop: true,
                  }}
                  isClickToPauseDisabled={true}
                  height={"250px"}
                  width={"250px"}
                />
                <h1 style={{ textAlign: "center" }}>"No Result Found"</h1>
              </div>
            ) : (
              <> </>
            )}
            {this.state.page * 20 < this.state.count &&
            this.state.count !== undefined &&
            this.state.result.length > 0 &&
            !this.state.after_err ? (
              <div className={Styles.loader} ref={this.loader}>
                <Loader h="30" />
              </div>
            ) : this.state.after_err ? (
              <div className={Styles.loadError}>
                <div className={Styles.ErrorName}>
                  <I_ALERT h="18" />
                  Connection error
                </div>

                <div
                  className={Styles.reload_btn}
                  onClick={() =>
                    this.setState({ after_err: false }, () => {
                      this.observer_f();
                    })
                  }
                >
                  Reload
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
function Result(props) {
  return (
    <Link to={{ pathname: `/movie/${props.id}`, query: { id: props.id } }}>
      <div className={Styles.r_item}>
        <img
          className={Styles.r_img}
          alt="cover"
          src={props.img}
          width={45}
          height={67}
          onError={(e) => {
            e.target.src = require("../../data/img/icon-movie-64.png").default;
          }}
        />
        <div className={Styles.r_title}>{props.title}</div>
        <div className={Styles.r_advance}>
          <div className={Styles.r_rating}>
            {props.rating}
            <div>
              <I_STAR h="16" />
            </div>
          </div>
          {props.mpa_rating !== "" ? (
            <div className={Styles.mpa}>{props.mpa_rating}</div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </Link>
  );
}
function Hinter(props) {
  return (
    <li
      className={Styles.hintItem}
      role="option"
      aria-selected={props.selected}
    >
      {/*  <img src={props.pic} alt="." height="44" className={Styles.hint_image} /> */}
      <div className={Styles.hint_data}>
        <div className={Styles.hint_title}>{props.title}</div>
        {/*    <div className={Styles.hint_year}>{props.year}</div> */}
      </div>
    </li>
  );
}
export default withRouter(Search);
export { Result };
/* [
  "Action",
  "Adult",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "Game Show",
  "History",
  "Horror",
  "Musical",
  "Music",
  "Mystery",
  "News",
  "Reality-TV",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Talk-Show",
  "Thriller",
  "War",
  "Western",
];
 */
