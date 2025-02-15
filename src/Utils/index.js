import {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE,
} from "../Constants/content_types.js";
import IMAGE_DEFAULT from "../Imagens/imagem-default.png";
import genres_movies from "../Constants/movies_genres.js";
import genres_tvserie from "../Constants/tvserie_genres.js";
import orders_movies from "../Constants/movie_discover_order.js";
import orders_tvserie from "../Constants/tvserie_discover_order.js";

function getOrders(type) {
  if (type === CONTENT_TYPE_MOVIE) return orders_movies;
  else return orders_tvserie;
}

function getGenres(type) {
  if (type === CONTENT_TYPE_MOVIE) return genres_movies;
  else return genres_tvserie;
}

export {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE,
  IMAGE_DEFAULT,
  getOrders,
  getGenres,
};
