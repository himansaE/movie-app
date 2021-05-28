import React, { Component, createRef } from "react";
import ReactDOM from "react-dom";
import { Link, withRouter } from "react-router-dom";
import firebase, { FBAnalytics } from "../../functions/config/fbConfig";
import "firebase/auth";
import Loader from "../../data/svg/loader";
import Lottie from "react-lottie";
import _404 from "../../data/svg/31313-spaceman-404.json";
import {
  get_movie_details,
  get_suggestions,
  get_sub,
} from "../../functions/requests";
import Styles from "./movie.module.css";
import "firebase/firestore";
import {
  I_STAR,
  I_NEXT,
  I_DOWNLOAD,
  I_MAGNET,
  I_COPY,
  I_CLOSE,
  I_DOWN,
  I_BACK_ARROW,
  I_LIKE_OUTLINE,
  I_BOOKMARK_FILL,
  I_CAPTION,
  I_LIKE_FILL,
  I_SHARE,
  I_BOOKMARK,
} from "../../data/svg/svg";
import { copy, hashToMagnet, snackbar } from "../../functions/torrent";
import Error404 from "../404/Error404";
import { MovieList } from "../main/main";
import cssClass from "../../functions/extra/cssClass";
import Share from "../share/share";
import { getLike, removeLike, setLike } from "../../functions/requests/FBReq";
import { Helmet } from "react-helmet";
import ConnectionError from "../ConnectionError/ConnectoinError";
class Movie extends Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      imdb: undefined,
      about_cap: false,
      pop_up: false,
      pop_up_expand: false,
      suggestions: [],
      id: "",
      like: false,
      watchList: false,
      sub: undefined,
      scrollPos: 0,
      share: false,
      connection: true,
    };
    this.ref = createRef();
    this.image_data_con = createRef();
    this.image_next_btn = createRef();
    this.image_per_btn = createRef();
    this.popupDrawer = createRef();
    this.popup_height = 0;
  }

  componentDidMount() {
    // getUserData();
    this.loadData();
    window.addEventListener("linkXChange", this.loadData);
    window.addEventListener("popstate", this.triggerXChange);
    window.addEventListener("popstate", this.hidePopup);
    this.auth_fb = firebase.auth().onAuthStateChanged((user) => {
      if (firebase.auth().currentUser) {
        getLike(this.id).then((r) => {
          this.setState({ like: r.liked, watchList: r.watchlist });
        });
      } else {
        this.setState({ like: false, watchList: false });
      }
    });
  }
  componentWillUnmount() {
    window.removeEventListener("linkXChange", this.loadData);
    window.removeEventListener("popstate", this.triggerXChange);
    window.removeEventListener("popstate", this.hidePopup);
    this.auth_fb();
  }
  setScroll = (e) => {
    this.setState({ scrollPos: e });
  };

  triggerXChange = () => {
    var event = new CustomEvent("linkXChange", {
      detail: { id: this.props.match.params.data },
    });
    window.dispatchEvent(event);
  };
  hidePopup = (e) => {
    this.setState({ pop_up: false });
  };
  loadData = (e) => {
    this.setState({
      data: undefined,
      like: false,
      watchList: false,
      sub: undefined,
      connection: true,
    });
    this.id = this.props.match.params.data;
    if (e?.detail?.id) this.id = e.detail.id;
    this.setState({ id: this.id });
    get_movie_details({ id: this.id })
      .then((r) => {
        if (r.title === null)
          return ReactDOM.render(<Error404 />, this.ref.current);
        this.setState({ data: r }, () => {
          this.img_scroll({ target: this.image_data_con.current });
        });
        if (firebase.auth().currentUser) {
          getLike(this.id).then((r) => {
            console.log(r);
            this.setState({ like: r.liked, watchList: r.watchlist });
          });
        }
        get_suggestions(this.id).then((r) => this.setState({ suggestions: r }));

        FBAnalytics("Movie visit");
      })
      .catch((err) => this.setState({ connection: false }));
  };
  img_scroll = (e) => {
    if (this.image_next_btn && this.image_per_btn) {
      if (
        e.target.scrollLeft >=
        e.target.scrollWidth - (e.target.offsetWidth + 5)
      ) {
        this.image_next_btn.current.style.setProperty("--next", "none");
      } else {
        this.image_next_btn.current.style.setProperty("--next", "flex");
      }
      if (e.target.scrollLeft <= 2) {
        this.image_per_btn.current.style.setProperty("--per", "none");
      } else {
        this.image_per_btn.current.style.setProperty("--per", "flex");
      }
    }
  };
  render() {
    if (!this.state.connection) {
      return <ConnectionError retry={this.loadData} />;
    }
    if (this.state.data === undefined) {
      return (
        <div
          ref={this.ref}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      );
    }
    if (this.state.data === false) {
      return (
        <div className={Styles.error_page} ref={this.ref}>
          <Lottie
            options={{
              animationData: _404,
              autoplay: true,
              loop: true,
            }}
            isClickToPauseDisabled={true}
            height={"250px"}
            width={"250px"}
          />
          <h1 style={{ color: "var(--text-color-dim)" }}>"Page Not Found"</h1>
        </div>
      );
    }

    //this is where main content go
    return (
      <div
        ref={this.ref}
        key={this.state.id}
        className={Styles.main + " " + (this.state.pop_up ? Styles.popped : "")}
        onScroll={(e) => {
          this.setScroll(e.target.scrollTop);
          e.target.style.setProperty("--scroll_pos", e.target.scrollTop);
        }}
      >
        <Helmet
          title={`${this.state.data.title} - ( ${this.state.data.year} )`}
          meta={[
            {
              property: "og:title",
              content: `${this.state.data.title} - ( ${this.state.data.year} )`,
            },
            {
              property: "og:image",
              content: this.state.data.medium_cover_image,
            },
            {
              property: "twitter:title",
              content: `${this.state.data.title} - ( ${this.state.data.year} )`,
            },
            {
              property: "twitter:image",
              content: this.state.data.medium_cover_image,
            },
          ]}
        />

        <div className={Styles.header_con}>
          <div
            className={Styles.background}
            style={{
              backgroundImage: `url(${this.state.data.background_image})`,
            }}
          >
            <div className={Styles.bottom}></div>
          </div>
          <div className={Styles.header}>
            <img
              className={Styles.cover_image}
              src={this.state.data.medium_cover_image}
              alt={"cover"}
              onError={(e) => {
                e.target.src = require("../../data/img/empty.png").default;
                e.target.style.backgroundImage = `url(${
                  require("../../data/img/icon-movie-64.png").default
                })`;
              }}
            />
            <h2 className={Styles.title}>{this.state.data.title}</h2>
            <div className={Styles.year}>{this.state.data.year}</div>
            <div className={Styles.ad_values}>
              <div className={Styles.ad_value_item}>
                <div>
                  {this.state.data.rating} <I_STAR h="16" />
                </div>
                <div className={Styles.hr} />
              </div>
              <div className={Styles.ad_value_item}>
                {this.state.data.runtime
                  ? this.state.data.runtime + "min"
                  : "-"}
                <div className={Styles.hr} />
                <div className={Styles.ad_value_item}>
                  {this.state.data.mpa_rating ? (
                    <a
                      className={Styles.mpa}
                      href="https://www.filmratings.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.state.data.mpa_rating}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
            <div className={Styles.d_button}>
              <div
                onClick={() => {
                  if (this.state.pop_up === "down") return;
                  this.setState({ pop_up: "down", pop_up_expand: false });
                }}
              >
                Download
              </div>
            </div>
          </div>
          {/* //todo options here */}
          <div className={Styles.options}>
            <div
              className={Styles.opt_item_c}
              onClick={() => {
                if (!firebase.auth().currentUser)
                  return snackbar("login to use this");

                if (!this.state.like) {
                  setLike(this.id, "like");
                  this.setState({ like: true });
                } else {
                  removeLike(this.id, "like");
                  this.setState({ like: false });
                }
              }}
            >
              {this.state.like ? (
                <>
                  <I_LIKE_FILL /> Liked
                </>
              ) : (
                <>
                  <I_LIKE_OUTLINE /> Like
                </>
              )}
            </div>

            <div
              className={Styles.opt_item_c}
              onClick={() => {
                if (!firebase.auth().currentUser)
                  return snackbar("login to use this");
                if (!this.state.watchList) {
                  setLike(this.id, "watchlist");
                  this.setState({ watchList: true });
                } else {
                  removeLike(this.id, "watchlist");
                  this.setState({ watchList: false });
                }
              }}
            >
              {this.state.watchList ? (
                <>
                  <I_BOOKMARK_FILL />
                  Added
                </>
              ) : (
                <>
                  <I_BOOKMARK />
                  Watchlist
                </>
              )}
            </div>

            {this.state.sub ? (
              <div className={Styles.opt_item_c}>
                <a href={this.state.sub} target="_blank" rel="noreferrer">
                  <I_CAPTION />
                  Go to site
                </a>
              </div>
            ) : this.state.sub === undefined ? (
              <div
                className={Styles.opt_item_c}
                onClick={() => {
                  this.setState({ sub: false }, () => {
                    get_sub(
                      this.state.data.slug,
                      this.state.data.imdb_code
                    ).then((r) => this.setState({ sub: r }));
                  });
                }}
              >
                <I_CAPTION />
                Subtitle
              </div>
            ) : (
              <div className={Styles.opt_item_c}>
                <I_CAPTION />
                Checking
              </div>
            )}
          </div>
        </div>
        <div className={Styles.genres}>
          {this.state.data.genres &&
            this.state.data.genres.map((i) => (
              <div key={i} className={Styles.genres_i}>
                <Link to={`/genre/${i.toLowerCase()}`}> {i} </Link>
              </div>
            ))}
        </div>
        <div className={Styles.image_data_con_p}>
          <div
            className={Styles.image_pre_btn}
            ref={this.image_per_btn}
            onClick={() => {
              this.image_data_con.current.scrollBy(-300, 0);
            }}
          >
            <I_NEXT />
          </div>
          <div
            className={Styles.image_next_btn}
            ref={this.image_next_btn}
            onClick={() => {
              this.image_data_con.current.scrollBy(300, 0);
            }}
          >
            <I_NEXT />
          </div>

          <div
            className={Styles.image_data_con}
            ref={this.image_data_con}
            onScroll={this.img_scroll}
          >
            <div className={Styles.image_data}>
              <iframe
                className={Styles.ytd_player}
                lazy={"true"}
                src={`https://www.youtube.com/embed/${this.state.data.yt_trailer_code}?autoplay=0&showinfo=0&frameborder="0"&controls=1&loop=1&modestbranding=1&iv_load_policy=3&theme=light&color=white"`}
                allowFullScreen={true}
                title="Trailer"
              />
            </div>
            <img
              className={Styles.image_data}
              src={this.state.data.medium_screenshot_image1}
              alt="screenshot"
            />
            <img
              className={Styles.image_data}
              src={this.state.data.medium_screenshot_image2}
              alt="screenshot"
            />
            <img
              className={Styles.image_data}
              src={this.state.data.medium_screenshot_image3}
              alt="screenshot"
            />
          </div>
        </div>
        <div
          className={Styles.about_con}
          onClick={() => {
            if (this.state.pop_up === "about") return;
            this.setState({ pop_up: "about" });
          }}
        >
          <Link to="#about">
            <div className={Styles.about_head}>
              <div>
                <div
                  className={Styles.about_title}
                  style={{ color: "var(--text-color)" }}
                >
                  About {this.state.data.title}
                </div>
              </div>

              <div className={Styles.about_icon}>
                <div>
                  <I_NEXT />
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 0" }}>
              <div className={Styles.about_fake_text}>
                {this.state.data.description_full
                  .split(" ")
                  .slice(0, 30)
                  .join(" ") + " ..."}
              </div>
            </div>
          </Link>
        </div>
        <div>
          <MovieList
            title="Similar Movies"
            data={this.state.suggestions}
            align={"start"}
            trigger={true}
          />
        </div>
        <>
          {this.state.pop_up === "down" ? (
            //download page
            <div
              className={Styles.popup_con_outer}
              onClick={(e) => {
                if (e.target !== e.currentTarget) return;
                this.setState({ pop_up: false });
              }}
            >
              <div className={Styles.popup_con} ref={this.popupDrawer}>
                <h1 className={Styles.popup_head}>
                  <div>Downloads</div>
                  <div
                    className={
                      Styles.pop_up_updown +
                      " " +
                      (this.state.pop_up_expand ? Styles.pop_up_open_icon : " ")
                    }
                    onClick={(e) => {
                      if (this.state.pop_up_expand) {
                        this.setState({ pop_up_expand: false });
                        this.popupDrawer.current.style.maxHeight = "500px";
                      } else {
                        this.setState({ pop_up_expand: true });
                        this.popupDrawer.current.style.maxHeight = "100vh";
                      }
                    }}
                  >
                    <I_DOWN />
                  </div>
                  <div
                    className={Styles.pop_up_close}
                    onClick={(e) => {
                      this.setState({ pop_up: false });
                    }}
                  >
                    <I_CLOSE />
                  </div>
                </h1>
                <div className={Styles.pop_up_body}>
                  <h1 className={Styles.download_head}>
                    <a href="/">Select movie quality </a>
                  </h1>
                  <div className={Styles.download_body}>
                    {this.state.data.torrents &&
                      this.state.data.torrents.map((i, n) => {
                        return (
                          <div key={n} className={Styles.download_item}>
                            <div className={Styles.download_image_q}>
                              <img
                                src={
                                  require(`../../data/svg/${i.quality}.svg`)
                                    .default
                                }
                                alt=""
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                            <div className={Styles.download_type}>{i.type}</div>
                            <div className={Styles.download_size_name}>
                              Size
                            </div>
                            <div className={Styles.download_size}>{i.size}</div>
                            <div className={Styles.download_download_btn}>
                              <a href={i.url}>
                                <I_DOWNLOAD fill="#cccccc" h="22" />
                                download
                              </a>
                            </div>
                            <div className={Styles.download_mag_btn}>
                              <a
                                href={hashToMagnet(
                                  i.hash,
                                  `${this.state.data.title_long} [${i.quality}] [movie] `
                                )}
                                className={Styles.download_mag_open}
                              >
                                <div className={Styles.download_mag_icon}>
                                  <I_MAGNET fill="#cccccc" h="22" />
                                </div>
                                Magnet
                              </a>
                              <div
                                className={Styles.download_mag_copy}
                                title="Copy Magnet Link"
                                onClick={() => {
                                  copy(
                                    hashToMagnet(
                                      i.hash,
                                      `${this.state.data.title_long} [${i.quality}] [movie]`
                                    )
                                  );
                                }}
                              >
                                <I_COPY fill="#cccccc" h="22" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {
            //about page
            this.state.pop_up === "about" ? (
              <div className={Styles.popup_about_con}>
                <div className={Styles.popup_about_head}>
                  <div
                    className={Styles.back_btn}
                    onClick={() => {
                      this.setState({ pop_up: false });
                    }}
                  >
                    <I_BACK_ARROW />
                  </div>
                  <h1>about</h1>
                </div>
                <div className={Styles.popup_about_body}>
                  <div className={Styles.popup_about_item}>
                    <h2 className={Styles.popup_about_title}>
                      Cast of {this.state.data.title}
                    </h2>
                    <div className={Styles.popup_about_cast}>
                      {this.state.data.cast &&
                        this.state.data.cast.map((i) => {
                          return (
                            <div
                              className={Styles.popup_about_cast_main}
                              key={i.imdb_code}
                            >
                              <a
                                href={`https://www.imdb.com/name/nm${i.imdb_code}/`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={
                                    i.url_small_image ||
                                    require("../../data/svg/person.svg").default
                                  }
                                  alt=""
                                  onError={(e) =>
                                    (e.target.src =
                                      require("../../data/svg/person.svg").default)
                                  }
                                />
                                <div className={Styles.popup_about_real_name}>
                                  {i.name}
                                </div>
                                <div className={Styles.about_as}> as</div>
                                <div className={Styles.popup_about_cast_name}>
                                  {i.character_name}
                                </div>
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className={Styles.popup_about_item}>
                    <h2
                      className={Styles.popup_about_title}
                      style={{ marginTop: "30px" }}
                    >
                      About this movie
                    </h2>
                    <p className={Styles.popup_about_about}>
                      {this.state.data.description_full}
                    </p>
                  </div>
                  <div className={Styles.popup_about_item}>
                    <table className={Styles.popup_about_table}>
                      <tbody>
                        <tr>
                          <td>language</td>
                          <td>{this.state.data.language.toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td>rating</td>
                          <td>{this.state.data.rating}</td>
                        </tr>
                        <tr>
                          <td>runtime</td>
                          <td>{flat_time(this.state.data.runtime)}</td>
                        </tr>
                        <tr>
                          <td>year</td>
                          <td>{this.state.data.year}</td>
                        </tr>
                        <tr>
                          <td>uploaded</td>
                          <td>
                            {new Date(this.state.data.date_uploaded)
                              .toDateString()
                              .split(" ")
                              .filter((i, n) => {
                                if (n !== 0) return true;
                                return false;
                              })
                              .join(" ")}
                          </td>
                        </tr>
                        <tr>
                          <td>downloads</td>
                          <td>{this.state.data.download_count}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={Styles.popup_about_item}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <div className={Styles.IMDb_logo}>
                      <a
                        style={{ color: "black" }}
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.imdb.com/title/${this.state.data.imdb_code}`}
                      >
                        IMDb
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )
          }
        </>
        <div
          className={cssClass(
            Styles.shareBtn,
            this.state.scrollPos < 120 ? Styles.share_ex : Styles.share_cap
          )}
          onClick={() => {
            if (!navigator.share) return this.setState({ pop_up: "share" });
            navigator.share({
              title: `Download movie on Movie-sh `,
              text: `Download ${this.state.data.title_long} with movie-sh`,
              url: window.location.href,
            });
          }}
        >
          {/* share button */}

          <div className={Styles.shareTxt}>Share</div>
          <I_SHARE />
        </div>
        {this.state.pop_up === "share" ? (
          <Share
            hidePopup={this.hidePopup}
            url={window.location.href}
            title={this.state.data.title_long}
            text="Download torrent movies with movie-sh"
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default withRouter(Movie);
/* */
function flat_time(m) {
  if (m < 60) return m;
  if (m < 60 * 60) return `${Math.floor(m / 60)}h ${Math.floor(m % 60)}m`;
}
