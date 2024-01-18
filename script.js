const API_KEY = 'api_key=c93b630fcdddfdee8aab819a7554adbb'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const main = document.getElementById('main')
const form = document.getElementById('form')
const searchURL = BASE_URL+ '/search/movie?' + API_KEY
const search = document.getElementById('search')
const tagsEl = document.getElementById('tags') 
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
let selectedGenre = []
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPage = 100;

const genres = [
    {
      id: 28,
      name: "Action"
    },
    {
      id: 12,
      name: "Adventure"
    },
    {
      id: 16,
      name: "Animation"
    },
    {
      id: 35,
      name: "Comedy"
    },
    {
      id: 80,
      name: "Crime"
    },
    {
      id: 99,
      name: "Documentary"
    },
    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Family"
    },
    {
      id: 14,
      name: "Fantasy"
    },
    {
      id: 36,
      name: "History"
    },
    {
      id: 27,
      name: "Horror"
    },
    {
      id: 10402,
      name: "Music"
    },
    {
      id: 9648,
      name: "Mystery"
    },
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Science Fiction"
    },
    {
      id: 10770,
      name: "TV Movie"
    },
    {
      id: 53,
      name: "Thriller"
    },
    {
      id: 10752,
      name: "War"
    },
    {
      id: 37,
      name: "Western"
    }
  ]
getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
      if(data.results.length != 0){
        showMovie(data.results)
        currentPage = data.page; 
        totalPage = data.total_pages;
        nextPage = currentPage + 1
        prevPage = currentPage - 1;
        current.innerText = currentPage;

        if(currentPage <= 1){
          prev.classList.add('disabled')
          next.classList.remove('disabled')
        }else if(currentPage >= totalPage){
          prev.classList.remove('disabled')
          prev.classList.add('disabled')
        }else{
          prev.classList.remove('disabled')
          prev.classList.remove('disabled')
        }

        tagsEl.scrollIntoView({behavior : 'smooth'})

      }else {
        main.innerHTML = `<h1>No Results Found</h1>`
      }
    })
}
function clearBtn(){
  let clearBtn = document.getElementById('clear')
  if(clearBtn){
    clearBtn.classList.add('highlight')
  }else{
  let clear = document.createElement('div')
  clear.classList.add('tag', 'highlight')
  clear.id = 'clear'
  clear.innerText = 'Clear X'
  clear.addEventListener('click', () => {
    selectedGenre = []
    setGenre();
    getMovies(API_URL)
  })
  tagsEl.append(clear)
}}
setGenre()
function setGenre() {
    tagsEl.innerHTML = ''
    genres.forEach(genre => {
        const t = document.createElement('div')
        t.classList.add('tag')
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id)
            }else {
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id = genre.id){
                            selectedGenre.splice(idx, 1)
                        }
                    })
                }else {
                    selectedGenre.push(genre.id)
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add('highlight')
    })
    }
}



function showMovie(data){

    main.innerHTML= ''

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie 
        const movieEL = document.createElement('div')
        movieEL.classList.add('movie')
        movieEL.innerHTML = `
        <img src="${IMG_URL+ poster_path}" alt="image">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class=${showColor(vote_average)}>${vote_average}</span>
        </div>

        <div class="overview">${overview}
          </br>
          <button class="know-more" id="${id}">Know More</button>
        </div>
        

        `

        main.appendChild(movieEL)
        document.getElementById(id).addEventListener('click',() => {
          console.log(id)
          openNav(movie)
        })
    })
}


const overlayContent = document.getElementById('overlay-content');
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
    if(videoData){
      document.getElementById('myNav').style.width = '100%';
      if(videoData.results.length > 0){
        var embed = [];
        videoData.results.forEach(video => {
          let {name, key, site} = video

          if(site == 'YouTube'){
          embed.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}?si=kGByu7qUo3Y2ug5j" title="${name}" class= "embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          `)}
        })
        
          overlayContent.innerHTML = embed.join("");
          activeSlide = 0;
          showVideos()
      }else{
        overlayContent.innerHTML =`<h1>No Result Found</h1>`

      }
    }
    console.log(videoData)
  })
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}


var activeSlide = 0;
function showVideos(){
  let embedClasses = document.querySelectorAll('.embed')
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')
    }else{
      embedTag.classList.add('hide')
      embedTag.classList.remove('show')

    }
  })
}


function showColor(vote){
    if(vote >= 8){
    return 'green'
}else if(vote >= 5){
    return 'orange'
} else {
    return 'red'
}}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    selectedGenre = []
    highlightSelection()
    if (searchTerm){
        getMovies(searchURL + '&query=' + searchTerm)

    }else{
        getMovies(API_URL)
    }
})

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage)
  }
})
next.addEventListener('click', () => {
  if(nextPage <= totalPage){
    pageCall(nextPage)
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?')
  let queryParams = urlSplit[1].split('&')
  let key = queryParams[queryParams.length - 1].split('=')
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page;
    getMovies(url)
  }else {
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] =a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b;
    getMovies(url);
  }
}