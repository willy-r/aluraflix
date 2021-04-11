import { getMovieDetails } from './TMDBApi/crawler.js';
import { diplaySearchMovieNotFoundError, movieAlreadyAdded } from './errors.js';

// Mostra/esconde o botão de voltar para todos os filmes.
function backMoviesButton(display = false) {
  const button = document.querySelector('.back-movies-button');

  if (display) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
}

// Mostra/esconde o botão de remover todos os filmes que foram adicionados.
function removeMoviesButton(display = false) {
  const button = document.querySelector('.remove-movies-button');

  if (display) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
}

// Mostra apenas o filme que foi pesquisado se ele existir, escondendo todos os outros.
function displayAddedMovie(movie) {
  const movies = document.querySelectorAll('.movie-wrapper');

  movies.forEach(function(movieWrapper) {
    const movieName = movieWrapper.querySelector('.name').textContent.toLowerCase().trim();
    
    if (movie !== movieName) {
      movieWrapper.style.display = 'none';
    }
  });
  backMoviesButton(true);
  removeMoviesButton(false);
}

// Retorna true se o filme existir, se não retorna false.
function validateMovie(movie) {
  const movies = document.querySelectorAll('.movie-wrapper');
  const movieNames = [];
  
  movies.forEach(function(movieWrapper) {
    const movieName = movieWrapper.querySelector('.name').textContent.toLowerCase().trim();
    movieNames.push(movieName);
  });

  return movieNames.includes(movie);
}

// Procura pelo filme que foi adicionado, caso contrário exibe uma mensagem de erro.
function searchForAddedMovie() {
  const movieNameInput = document.querySelector('#search-movie-name');
  const movieName = movieNameInput.value.toLowerCase();

  if (validateMovie(movieName)) {
    displayAddedMovie(movieName);
  } else {
    diplaySearchMovieNotFoundError();
  }
  movieNameInput.value = '';
}

// Mostra todos os filmes novamente.
function backAllMovies() {
  const movies = document.querySelectorAll('.movie-wrapper');

  movies.forEach(function(movieWrapper) {
    movieWrapper.style.display = 'flex';
  });
  backMoviesButton(false);
  removeMoviesButton(true);
}

// Mostra o filme na tela.
function displayMovieOnScreen(movieDetails) {
  const divMoviesContainer = document.querySelector('.movies-container');
  const figure = `
  <figure class="movie-wrapper">
    <a href="#go-top">
      <button class="action" id="display-modal-button" title="Fechar"
        data-movie-name="${movieDetails['title'].replace(/\"/g, '&#34;')}"
        data-release-year="${movieDetails['releaseYear']}"
        data-synopsis="${movieDetails['synopsis'].replace(/\"/g, '&#34;')}"
        data-trailer-url='${JSON.stringify(movieDetails['trailerURL'])}'
        data-avaliation="${movieDetails['avaliation']}">
        !
      </button>
    </a>
    <img class="poster" src="${movieDetails['posterURL']}" alt="Imagem de cartaz do filme ${movieDetails['title']}">
    <figcaption class="name">${movieDetails['title']}</figcaption>
  </figure>
  `;
  divMoviesContainer.insertAdjacentHTML('beforeend', figure);
}

// Mostra/limpa a mensagem quando um filme é adicionado/quando todos os filmes são removidos.
function noMoviesMessage(display = false) {
  const message = document.querySelector('.no-movies-message');

  if (display) {
    message.style.display = 'block';
  } else {
    message.style.display = 'none';
  }
}

// Adiciona um novo filme na tela se ele ainda não foi adicionado.
async function addMovie() {
  const movieNameInput = document.querySelector('#movie-name');
  const movieReleaseYearInput = document.querySelector('#movie-release-year');
  
  const movieDetails = await getMovieDetails(movieNameInput.value, movieReleaseYearInput.value);
  if (movieDetails !== undefined) {
    const movie = movieDetails['title'].toLowerCase();

    if (validateMovie(movie)) {
      movieAlreadyAdded();
    } else {
      displayMovieOnScreen(movieDetails);
      noMoviesMessage(false);
      removeMoviesButton(true);
    }
  }

  movieNameInput.value = '';
  movieReleaseYearInput.value = '';
}

// Remove todos os filmes que foram adicionados.
function removeMovies() {
  const movies = document.querySelectorAll('.movie-wrapper');

  movies.forEach(function(movieWrapper) {
    movieWrapper.outerHTML = '';
  });
  noMoviesMessage(true);
  removeMoviesButton(false);
}

const addMovieForm = document.querySelector('.add-movie-form');
addMovieForm.addEventListener('submit', function(event) {
  event.preventDefault();
  addMovie();
});

const searchMovieForm = document.querySelector('.search-form');
searchMovieForm.addEventListener('submit', function(event) {
  event.preventDefault();
  searchForAddedMovie();
});

const backButton = document.querySelector('.back-movies-button');
backButton.addEventListener('click', backAllMovies);

const removeButton = document.querySelector('.remove-movies-button');
removeButton.addEventListener('click', removeMovies);