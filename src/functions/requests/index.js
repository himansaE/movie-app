import axios from "axios";
const torrent_api_domain = "https://yts.mx/api/v2/";
function get_hint(value) {
  return axios
    .get(`${torrent_api_domain}list_movies.json?query_term=${value}&limit=6`)
    .then((r) => {
      var data = [];
      if (r.data.data.movies) {
        r.data.data.movies.forEach((i) => {
          data.push({
            title: i.title,
            pic_path: i.small_cover_image,
            year: i.year,
          });
        });
      }
      if (data.length > 0) return data;
      return null;
    });
}
function get_results(q) {
  q["limit"] = 20;
  return axios
    .get(`${torrent_api_domain}list_movies.json`, {
      params: q,
    })
    .then((r) => r.data.data)
    .catch((r) => r.toJSON());
}
function get_chunk_results(q = {}) {
  q["limit"] = 20;
  //console.log(q);
  return axios
    .get(`${torrent_api_domain}list_movies.json`, {
      params: q,
    })
    .then((r) => {
      return {
        page_number: r.data.data.page_number,
        movie_count: r.data.data.movie_count,
        data: r.data.data.movies.map((i) => {
          return {
            id: i.id,
            medium_cover_image: i.medium_cover_image,
            rating: i.rating,
            title_long: i.title_long,
            year: i.year,
          };
        }),
      };
    })
    .catch((r) => r.toJSON());
}
function get_movie_details(obj) {
  return axios
    .get(`${torrent_api_domain}movie_details.json`, {
      params: {
        movie_id: obj.id,
        with_images: true,
        with_cast: true,
      },
      cancelToken: obj.cancelT?.token,
    })
    .then((r) => {
      if (!r.data.data.movie) {
        throw Error("no result found");
      }
      return r.data.data.movie;
    })
    .catch((err) => {
      throw Error("network err");
    });
}
function get_suggestions(id) {
  return axios
    .get(`${torrent_api_domain}movie_suggestions.json`, {
      params: {
        movie_id: id,
      },
    })
    .then((r) => r.data.data.movies)
    .catch((r) => []);
}
function get_sub(slug, imdb) {
  const cors = "https://cors-anywhere.herokuapp.com/";
  let x = [
    `https://www.baiscopelk.com/${slug}-sinhala-subtitles/`,
    `https://www.baiscopelk.com/${slug}-with-sinhala-subtitles/`,
    `https://yifysubtitles.org/movie-imdb/${imdb}`,
  ];
  return axios
    .get(`${cors}${x[0]}`)
    .then((r) => {
      return x[0];
    })
    .catch(() => {
      return axios
        .get(`${cors}${x[1]}`)
        .then((r) => {
          return x[1];
        })
        .catch(() => x[2]);
    });
}

export {
  get_hint,
  get_results,
  get_movie_details,
  get_suggestions,
  get_chunk_results,
  get_sub,
};
