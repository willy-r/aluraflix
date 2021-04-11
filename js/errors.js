// Limpa a mensagem de erro.
export function clearErrorMessage(element) {
    element.style.display = 'none';
  }
  
// Mostra a mensagem de erro por um período de tempo e depois limpa ela.
export function displayErrorMessage(element, time) {
  element.style.display = 'block';
  setTimeout(clearErrorMessage, time, element);
}

// Mostra a mensagem de erro caso o filme não seja encontrado.
export function displayMovieNotFoundError() {
  const errorMessage = document.querySelector('#movie-name-error');
  displayErrorMessage(errorMessage, 5000);
}

export function movieAlreadyAdded() {
  const errorMessage = document.querySelector('#movie-already-added');
  displayErrorMessage(errorMessage, 5000);
}

// Mostra a mensagem de erro caso algum erro inesperado ocorra.
export function displayUnknownError() {
  const errorMessage = document.querySelector('#unknown-error');
  displayErrorMessage(errorMessage, 5000);
}

// Mostra a mensagem de erro caso um filme que foi adicionado não seja encontrado.
export function diplaySearchMovieNotFoundError() {
  const errorMessage = document.querySelector('#search-movie-name-error');
  displayErrorMessage(errorMessage, 3000);
}