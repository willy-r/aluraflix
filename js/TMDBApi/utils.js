import { displayErrorMessage } from '../errors.js';

// Gera uma URL válida usando o path especificado (sem "/" no início e no final),
// e com os params especificados no formato de um JSON.
export function generateValidURL(base, path, params = null) {
  let fullURL = new URL(path, base);
  
  if (params) {
    fullURL.searchParams.set('api_key', '4216296b295c771aad6a39673f4beb73');
    Object.entries(params).forEach(function(paramsList) {
      fullURL.searchParams.set(paramsList[0], paramsList[1]);
    });
  }
  return fullURL;
}

// Não precisa verificar o limite mínimo do ano (por exemplo 1000), a API não levará em consideração.
export function verifyYear(year) {
  return (
    (year.length === 4) && (!isNaN(parseInt(year)))
  );
}

// Retorna os parâmetros para colocar na URL.
export function getParams(movie, year) {
  let params = { 'query': movie };

  if (year !== '') {
    // O ano foi inserido, coloca ele nos parâmetros se for válido.
    if (!verifyYear(year)) {
      const errorMessage = document.querySelector('#movie-release-year-error');
      displayErrorMessage(errorMessage, 2500);
    } else {
      params['year'] = year;
    }
  }
  return params;
}