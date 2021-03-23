import React, { Component, createRef } from "react";
import ReactDOM from "react-dom";
import { FBAnalytics } from "../../functions/config/fbConfig";
import Error404 from "../404/Error404";
import Loader from "../../data/svg/loader";
import { get_results } from "../../functions/requests";
import { MovieList } from "../main/main";

const list = [
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
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default class Genre extends Component {
  constructor() {
    super();
    this.state = {
      id: undefined,
      data: [],
    };
    this.ref = createRef();
  }
  componentDidMount() {
    if (this.props.location.query) {
      console.log(this.props.location.query.id);
      this.id = this.props.location.query.id;
    } else {
      this.id = this.props.match.params.data;
    }
    if (!list.find((i) => i.toUpperCase() === this.id.toUpperCase())) {
      return ReactDOM.render(<Error404 />, this.ref.current);
    }
    this.template = [
      {
        title: `${capitalize(this.id)} Movies Newly Added`,
        data: null,
        params: { limit: 8, genre: this.id },
      },
      {
        title: `New Released ${capitalize(this.id)}  Movies`,
        data: null,
        params: { limit: 10, sort_by: "year", genre: this.id },
      },
      {
        title: `Top Rated ${capitalize(this.id)}  Movies`,
        data: null,
        params: { limit: 10, sort_by: "rating", genre: this.id },
      },
      {
        title: `Most Downloaded ${capitalize(this.id)}  Movies`,
        data: null,
        params: { limit: 10, sort_by: "download_count", genre: this.id },
      },
    ];

    this.template.forEach((i, n) => {
      get_results(i.params).then((r) => {
        i.data = r.movies;
        this.setState({ data: [...this.state.data, i] });
      });
    });
    FBAnalytics("Genre " + this.id);
    document.title = `${capitalize(this.id)} Movies`;
  }
  render() {
    if (this.state.data === undefined)
      return (
        <div ref={this.ref}>
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </div>
        </div>
      );

    return (
      <div ref={this.ref} style={{ overflowX: "auto", padding: "22px 0" }}>
        {this.state.data.map((i, n) => {
          return <MovieList title={i.title} data={i.data} key={i.title} />;
        })}
      </div>
    );
  }
}
