import { generateValidURL, getParams } from './utils.js';
import { movieDetailsParser } from './parser.js';
import { displayMovieNotFoundError, displayUnknownError } from '../errors.js';

// Procura pelo filme na API e retorna uma promise com a resposta da API.
function searchMovie(baseURL, movie, year) {
  const params = getParams(movie, year); // Trata o ano.
  const searchMovieURL = generateValidURL(baseURL, 'search/movie', params);
  return fetch(searchMovieURL);
}

// Retorna uma promise com os detalhes do filme como resposta.
function movieDetails(baseURL, id) {
  const params = {
    'language': 'pt-BR',
    'append_to_response': 'videos',
  }
  const movieDetailsURL = generateValidURL(baseURL, `movie/${id}`, params);
  return fetch(movieDetailsURL); 
}

// Retorna os detalhes do filme ou exibe uma mensagem de erro se o filme não for encontrado.
export async function getMovieDetails(movie, year) {
  var baseURL = 'https://api.themoviedb.org/3/';
  
  try {
    const responseSearch = await searchMovie(baseURL, movie, year);
    const dataSearch = await responseSearch.json();

    if (!dataSearch['total_results']) {
      displayMovieNotFoundError();
    } else {
      const movieID = dataSearch['results'][0]['id']; // Pega o ID do primeiro filme (o mais popular).
      const responseMovieDetails = await movieDetails(baseURL, movieID);
      const dataMovieDetails = await responseMovieDetails.json();
      return movieDetailsParser(dataMovieDetails);
    }
  } catch (err) {
    displayUnknownError();
  }
}