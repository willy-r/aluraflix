import { generateValidURL } from './utils.js';

// Retorna o título traduzido do filme, ou o título original caso não exista.
function getMovieTitle(title, original_title) {
  if (title) {
    return title;
  }
  return original_title;
}

// Retorna a URL para a imagem de cartaz do filme, ou o path de uma imagem genérica caso não exista.
function getPosterMovieURL(posterPath) {
  if (posterPath) {
    const posterURL = generateValidURL(
      'https://image.tmdb.org/t/p/',
      `w185${posterPath}`,
    );
    return posterURL;
  }
  return 'images/fallback-image.png';
}

// Retorna a URL para o trailer do filme (do YouTube ou do Vimeo) ou o path de uma imagem genérica caso não exista.
function getMovieTrailerURL(trailers) {
  if (trailers.length) {
    const trailer = trailers[0]; // Pega o primeiro trailer.

    if (trailer['site'] === 'YouTube') {
      var baseURL = 'https://www.youtube.com/embed/';
    } else if (trailer['site'] === 'Vimeo') {
      var baseURL = 'https://player.vimeo.com/video/';
    }
    const trailerURL = generateValidURL(
      baseURL,
      trailer['key'],
    );
    return { 'hasTrailer': true, 'trailerURL': trailerURL };
  }
  return { 'hasTrailer': false, 'trailerURL': 'images/fallback-trailer.png' };
}

// Retorna a sinopse do filme ou uma sinopse genérica caso não exista.
function getMovieSynopsis(synopsis) {
  if (synopsis) {
    return synopsis;
  }
  return 'A sinopse deste filme não foi encontrada.';
}

// Retorna o ano de lançamento do filme.
function getMovieReleaseYear(releaseDate) {
  if (releaseDate) {
    return releaseDate.split('-')[0];
  }
  return 'Sem data';
}

// Retorna a avaliação do filme dependendo da quantidade de votos no site do TMDB.
function getMovieAvaliation(avaliation) {
  if (avaliation) {
    return `${avaliation}/10`;
  }
  return 'Não fornecido';
}

// Faz o parseamento das informações do filme e retorna apenas as informações necessárias.
export function movieDetailsParser(movieDetails) {
  return {
    'title': getMovieTitle(movieDetails['title'], movieDetails['original_title']),
    'posterURL': getPosterMovieURL(movieDetails['poster_path']),
    'trailerURL': getMovieTrailerURL(movieDetails['videos']['results']),
    'synopsis': getMovieSynopsis(movieDetails['overview']),
    'releaseYear': getMovieReleaseYear(movieDetails['release_date']),
    'avaliation': getMovieAvaliation(movieDetails['vote_average']),
  }
}