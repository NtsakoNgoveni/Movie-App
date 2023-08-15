/* MOVIE SEARCH WITH SEARCH API */
import { config } from "./config..js"; 

const KEY = `api_key=${config.KEY}`;
const BASE = 'https://api.themoviedb.org/3/';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500/';
const popular_api = BASE + 'movie/popular?' + KEY;

function getSearchCall()
{
    const search_item = document.querySelector('#search-bar').value;
    fetch(BASE + 'search/movie?' + `query=${search_item}&` + KEY)
        .then(res => res.json())
        .then(data => getSearch(data.results))
}

function getSearch(data)
{

    const searchResults = document.querySelector('.searchResults');
    searchResults.innerHTML = '';
    data.forEach(movie => 
        {
            const searchMovie = document.createElement('div');
            const {title, vote_average, poster_path, overview} = movie;
            searchMovie.innerHTML = `
            <div class="movie-box">
                <img class="poster" src="${IMG_BASE + poster_path}" alt="${title}">
                <p class="title"><b>${title}</b></p>
                <span class="rating">rating <span class="rating-value">${vote_average}</span></span>
                <p class="overview">${overview}</p>
            </div>`
            searchResults.appendChild(searchMovie)
        })
}