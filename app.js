
const KEY = `api_key=204a3e9d80fbf5cdd8dec216e7161245`;
const BASE = 'https://api.themoviedb.org/3/';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500/';
const IMG_BASE2 = 'https://image.tmdb.org/t/p/original';
var page = 1;
const popular_api = BASE + `movie/popular?` + KEY;
const top_rated_api = BASE + 'movie/top_rated?' + KEY;
var url = '';
const movies_container = document.querySelector('.movies-container');
var heading = '';


// Define a "Display movie" function 
const new_div = document.createElement('div');
new_div.classList.add('movies-container', 'topRated');
const append_h1 = document.createElement('h1');
append_h1.classList.add('heading');
const pagVisbility = document.querySelector('.pagination');

function displayMovies(data, heading, home=false)
{
    //const popular_movies = document.querySelector(container)
       
        append_h1.innerHTML = heading;
        const main_el = document.querySelector('main');

    if(!home)
    { 
        movies_container.innerHTML = '';
        document.querySelector('.heading').innerHTML = heading;

        if (heading.localeCompare('Popular Movies') != 0 && heading.localeCompare('Top Rated') != 0)
        {
            new_div.style.display = 'none';
            append_h1.style.display = 'none';
            pagVisbility.style.display = 'flex';
        }     
    }
    else

    {
        main_el.appendChild(append_h1);
        main_el.appendChild(new_div);
        pagVisbility.style.display = 'none';

    }
    
    data.forEach(movie => 
        {
            const {title, vote_average, poster_path, overview, id} = movie
            const movieEl = document.createElement('div');
            movieEl.setAttribute('id', `${id}`);
            const arg_id = movieEl.getAttribute('id');
            movieEl.addEventListener('click', () => {clicked(arg_id)})
            movieEl.innerHTML = `
            <div class="movie-box" id=${id}>
                <img class="poster" src="${IMG_BASE + poster_path}" alt="${title}">
                <p class="title"><b>${title}</b></p>
                <span class="rating">rating <span class="rating-value">${vote_average}</span></span>
                <p class="overview">${overview}</p>
            </div>`
            if(!home && heading.localeCompare('Top Rated') != 0)
            {movies_container.appendChild(movieEl)}
            else {new_div.appendChild(movieEl)};
        })
}

// Fetch and display popular movies
fetch(popular_api)
    .then(res => res.json())
    .then(data => displayMovies(data.results, 'Popular Movies'))



//Fetch and display latest movies
fetch(top_rated_api)
    .then(res => res.json())
    .then(data => displayMovies(data.results, 'Top Rated', true))

// MOVIE SEARCH WITH SEARCH API

function getSearch()
{   
    heading = 'Search Results';
    const search_item = document.querySelector('#search-bar').value;
    if (search_item)
    {
        if (document.querySelector('.genres-cont'))
        {
        document.querySelector('.genres-cont').style.display = 'none';
        heading.style.display = 'none';
        document.querySelector('.main').style.display = 'unset';
        }
         url = BASE + 'search/movie?' + `query=${search_item}&` + KEY;
        fetch(url)
        .then(res => res.json())    
        .then(data => displayMovies(data.results, heading))
    }
    
}

//SHOW GENRE

const genreContainer = document.querySelector('.genre-container');
fetch(BASE + 'genre/movie/list?'+ KEY)
    .then(res => res.json())
    .then(data => data.genres)
    .then(data => data.forEach(genre=> 
        {
            const p = document.createElement('p');
            p.setAttribute('name', genre.name);
            p.setAttribute('id', genre.id);
            p.classList.add('genre');
            p.innerHTML = `${genre.name}`;
            p.addEventListener('click', setContainer) //PASS function to get movies by genre id
            genreContainer.appendChild(p)
        }))


//SET container custom container value for genre

function setContainer(event)
{
    document.body.scrollTo({
        top:0,
        behaviour:'smooth'
    });
    heading = `${event.target.innerHTML}`
    url = BASE + `discover/movie?with_genres=${event.target.id}&` + KEY;
    fetchPage(url, 1)
       // .then(res => res.json())
       // .then(data => displayMovies(data.results, heading))
}

//Displays a list of genres on the side Bar
function showGenre()
{
  const currStyle = window.getComputedStyle(genreContainer);
  if (currStyle.display == 'grid')
  {
        genreContainer.style.display = 'none';
  }
  else
  {
    genreContainer.style.display = 'grid';
  }
}


// PAGINATION
const paglist = document.querySelectorAll('[tabindex="0"]');

function pagination(event)
{
    const prev = document.querySelector('.fa-arrow-left');
    const next = document.querySelector('.fa-arrow-right');
    const index_1 = document.getElementById('index_1');
    const index_2 = document.getElementById('index_2');
    const index_3 = document.getElementById('index_3');
    const targetId = event.target.id;
    const currentPage = event.target.innerHTML;

    document.body.scrollTop = 0;
    if (targetId.localeCompare('index_3') == 0)
    {
        paglist.forEach(item => 
            {
                item.innerHTML = `${parseInt(item.innerHTML)+ 1}`;
                page = event.target.innerHTML;
            })
    }
    else if (targetId.localeCompare('index_1') == 0 && parseInt(event.target.innerHTML) > 1)
    {
        paglist.forEach(item => 
            {
                item.innerHTML = `${parseInt(item.innerHTML)- 1}`;
                page = event.target.innerHTML;
            })
           
    }
    paglist.forEach(item =>
        {
            if (item.innerHTML != currentPage)
            {
                item.classList.contains('active');
                item.classList.remove('active');
            }
            else{item.classList.add('active')};
        })
    fetchPage(url, currentPage);

    
}
console.log(page);
function fetchPage(_url, pageNum)
{
    const token = _url.split('?');
    const _base = token[0] + '?';

    if (token[1].includes('page'))
    {
        const params = token[1].split('&');
        params.pop();
        params.push(`page=${pageNum}`);
       var paramStr =  params.join('&');
        url = _base + KEY + '&' + paramStr;
    }
    else 
    {
        url = _base +`&${token[1]}`  + `&page=${pageNum}`;
    }

    fetch(url)
    .then(res => res.json())
    .then(data => displayMovies(data.results, heading));
}

// Movie page
function clicked(id)
{
fetch(`${BASE}movie/${id}?${KEY}&append_to_response=videos`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        moviePageFunction(data)
    })
}
function moviePageFunction(item)
{
    const {title, genres, vote_average, release_date,
            backdrop_path, overview, id, runtime, videos} = item;
    const nav = document.createElement('div');

    nav.innerHTML=`
    <div class="nav">
        <img onclick="window.location.href = './home.html'" src="home.png" class="homebtn"></img>
        <h1 class="heading_mov">${title}</h1>
        <div class="part_genre_cont">${genres.map(item =>{
            const genre = document.createElement('div');
            genre.classList.add('part_genre');
            genre.textContent = `${item.name}`;
            return genre.outerHTML;}).join('')
        }
        </div> 
        <div class="info_cont">
            <button class="info">
                <img class="play_trail" src="./play.png"/>
            </button>
            <div class="info">
                <p class="label_info">Rating</p>
                ${vote_average}
            </div>
            <div class="info">
                <p class="label_info">Release</p>
                ${release_date}
            </div>
            <div class="info">
                <p class="label_info">length</p>
                ${runtime} min
            </div>
        </div>
        <div class="overview_mov">
            <div>
                <h4>Overview</h4>
                <p>${overview}</p>
            </div>
        </div>
        <div class="iframe_cont">
        <iframe src="https://youtube.com/embed/${videos.results[0].key}" title="Youtube video player" frameborder="0" allowfullscreen></iframe>
        </div>
    </div > 
    
`
const body = document.querySelector('body');
body.style.background = `url(${IMG_BASE2 + backdrop_path})`;
body.style.backgroundSize = "cover";
body.innerHTML='';
body.appendChild(nav);
}