import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))


document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://movies-api.julienpoirier-webdev.com/search/movies';
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  let currentPage = 1;
  let currentQuery = '';

  const searchInput = document.getElementById('movieSearch');
  const searchBtn = document.getElementById('searchBtn');
  const movieListDiv = document.getElementById('movieList');
  const movieDetailsDiv = document.getElementById('movieDetails');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  searchBtn.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
      currentPage = 1;
      searchMovies(currentQuery, currentPage);
    }
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      searchMovies(currentQuery, currentPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    currentPage++;
    searchMovies(currentQuery, currentPage);
  });

  function searchMovies(query, page) {
    const url = `${apiUrl}/${query}/${page}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayMovies(data.results);
        updatePagination(data.total_pages);
      })
      .catch(error => console.error('Erreur lors de la recherche des films :', error));
  }

  function displayMovies(movies) {
    movieListDiv.innerHTML = '';
    movieListDiv.style.display = 'block';
    movieDetailsDiv.style.display = 'none';

    movies.forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie-item');

      const movieTitle = document.createElement('h3');
      movieTitle.textContent = movie.title;

      const movieImage = document.createElement('img');
      movieImage.src = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : '';

      const detailsBtn = document.createElement('button');
      detailsBtn.textContent = 'Détails';
      detailsBtn.addEventListener('click', () => displayMovieDetails(movie.id));

      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(movieImage);
      movieDiv.appendChild(detailsBtn);
      movieListDiv.appendChild(movieDiv);
    });
  }

  function updatePagination(totalPages) {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages;
  }

  function displayMovieDetails(movieId) {
    const detailsUrl = `https://movies-api.julienpoirier-webdev.com/infos/movies/${movieId}`;
    fetch(detailsUrl)
      .then(response => response.json())
      .then(movie => {
        movieDetailsDiv.innerHTML = '';
        movieDetailsDiv.style.display = 'block';
        movieListDiv.style.display = 'none';

        const title = document.createElement('h2');
        title.textContent = movie.title;

        const overview = document.createElement('p');
        overview.textContent = movie.overview;

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Date de sortie : ${movie.release_date}`;

        const backdrop = document.createElement('img');
        backdrop.src = movie.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : '';

        const backBtn = document.createElement('button');
        backBtn.textContent = 'Retour à la liste';
        backBtn.addEventListener('click', () => {
          movieListDiv.style.display = 'block';
          movieDetailsDiv.style.display = 'none';
        });

        movieDetailsDiv.appendChild(title);
        movieDetailsDiv.appendChild(overview);
        movieDetailsDiv.appendChild(releaseDate);
        movieDetailsDiv.appendChild(backdrop);
        movieDetailsDiv.appendChild(backBtn);
      })
      .catch(error => console.error('Erreur lors de la récupération des détails du film :', error));
  }
});
