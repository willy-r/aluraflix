const modalContainer = document.querySelector('.modal-container');
const bodyElement = document.querySelector('body');

// Mostra o ano atual (apenas para o footer).
function displayCurrentYear() {
  const today = new Date();
  const currentYear = today.getFullYear();
  document.querySelector('#current-year').textContent = currentYear;
}

// Adiciona/remove o scroll da página.
function doScroll(scroll = false) {
  if (scroll) {
    bodyElement.style.overflow = 'visible';
  } else {
    bodyElement.style.overflow = 'hidden';
  }
}

// Retorna os dados de um determinado filme.
function getMovieData(displayModalButton) {
  return {
    'movieName': displayModalButton.dataset.movieName,
    'releaseYear': displayModalButton.dataset.releaseYear,
    'synopsis': displayModalButton.dataset.synopsis,
    'trailerURL': JSON.parse(displayModalButton.dataset.trailerUrl),
    'avaliation': displayModalButton.dataset.avaliation,
  }
}

// Retorna o iframe se o trailer existir ou um img.
function getTrailerElement(trailerURL) {
  if (trailerURL['hasTrailer']) {
    const element = `<iframe width="580" height="400" src="${trailerURL['trailerURL']}" title="Player de vídeo do trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    return element;
  }
  const element = `<img src="${trailerURL['trailerURL']}" alt="Imagem dizendo que o trailer do filme não existe">`
  return element;
}

// Mostra os dados do filme no modal (ele sobrescreve o conteúdo anterior).
function displayMovieDataOnModal(displayModalButton) {
  const movieData = getMovieData(displayModalButton);
  const wrapperModal = document.querySelector('.wrapper-modal');
  const modal = `
  <div class="modal-header">
    <h1 class="title">
      ${movieData['movieName']} <span class="release">(${movieData['releaseYear']})</span>
    </h1>
    <button class="action" id="clear-modal-button" title="Fechar">x</button>
  </div>
            
  <div class="modal-content">
    <section class="synopsis">
      <h2 class="title">Sinopse:</h2>
      <p class="content">
        ${movieData['synopsis']}
      </p>
    </section>
    ${getTrailerElement(movieData['trailerURL'])}
  </div>

  <div class="modal-footer">
    <h2 class="title">
      Avaliação dos usuários (TMDB): <span class="avaliation">${movieData['avaliation']}</span>
    </h2>
  </div>
  `;
  wrapperModal.innerHTML = modal;
}

// Mostra o modal no topo da tela com as informações do filme.
function displayModal(event) {
  const element = event.target;

  if (element.id === 'display-modal-button') {
    displayMovieDataOnModal(element);
    doScroll(scroll = false);
    modalContainer.style.display = 'flex';
  }
}

// Limpa o modal da tela e adiciona o scroll na página novamente.
function clearModal() {
  modalContainer.style.display = 'none';
  doScroll(scroll = true);
}

// Limpa o modal quando clicar fora da área do modal ou no botão de limpar o modal.
function clearModalOnClick(event) {
  const element = event.target;
  
  if ((element.className === 'modal-container') || (element.id === 'clear-modal-button')) {
    clearModal();
  }
}

modalContainer.addEventListener('click', clearModalOnClick);

document.addEventListener('click', displayModal);

document.addEventListener('DOMContentLoaded', displayCurrentYear);