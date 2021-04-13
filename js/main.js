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
  const re = new RegExp(movie, 'i');

  movies.forEach(function(movieWrapper) {
    const movieName = movieWrapper.querySelector('.name').textContent;
    
    if (re.test(movieName)) {
      movieWrapper.style.display = 'flex';
    } else {
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
  const re = new RegExp(movie, 'i');
  
  movies.forEach(function(movieWrapper) {
    const movieName = movieWrapper.querySelector('.name').textContent;

    if (re.test(movieName)) {
      movieNames.push(movieName);
    }
  });
  console.log(movieNames);
  return movieNames.length !== 0;
}

// Procura pelo filme que foi adicionado, caso contrário exibe uma mensagem de erro.
function searchForAddedMovie() {
  const movieNameInput = document.querySelector('#search-movie-name');
  const movieName = movieNameInput.value;

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
      <button class="action" id="display-modal-button" 
        title="Ver informações do filme ${movieDetails['title']}"
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
  noMoviesMessage(false);
  backAllMovies();
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
    const movie = movieDetails['title'];

    if (validateMovie(movie)) {
      movieAlreadyAdded();
    } else {
      displayMovieOnScreen(movieDetails);
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
backButton.addEventListener('click', backMoviesButton);

const removeButton = document.querySelector('.remove-movies-button');
removeButton.addEventListener('click', removeMovies);