window.onload = setup

//You can edit ALL of the code here

const allShows = getAllShows().sort((a, b) =>
  a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : b.name.toLowerCase() > a.name.toLowerCase()
    ? -1
    : 0,
)
var allEpisodes = loadEpisodeData(allShows[0].id, false)

//////// Button to move up /////////
var root = document.getElementById('root')
var upBtn = document.createElement('button')
root.appendChild(upBtn)
upBtn.id = 'btnUp'
upBtn.addEventListener('click', () => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
})
upBtn.title = 'Go to top'
upBtn.innerText = 'Top'
window.onscroll = function () {
  scrollFunction()
}

function scrollFunction() {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    upBtn.style.display = 'block'
  } else {
    upBtn.style.display = 'none'
  }
}

function setup() {
  makePageForEpisodes()
}

function makePageForEpisodes() {
  const rootElem = document.getElementById('root')
  const header = document.querySelector('header')
  const headerImg = document.createElement('img')
  const navbar = document.createElement('nav')
  const searchBox = document.createElement('input')
  const searchLabel = document.createElement('label')
  const selectEpisode = document.createElement('select')
  const selectShows = document.createElement('select')

  headerImg.id = 'headerImg'
  header.appendChild(headerImg)
  setInterval(() => {
    loadBannerData(headerImg)
  }, 2000)

  searchBox.id = 'search'
  searchBox.type = 'text'
  searchBox.placeholder = 'Search'
  searchBox.autocomplete = 'off'

  searchLabel.for = 'search'
  searchLabel.id = 'searchLabel'

  selectEpisode.id = 'selectEpisode'
  selectShows.id = 'selectShows'

  document.body.appendChild(header)
  header.appendChild(navbar)
  navbar.appendChild(selectShows)
  navbar.appendChild(selectEpisode)
  navbar.appendChild(searchBox)
  navbar.appendChild(searchLabel)

  createOptionsOfShSelect(selectShows, allShows)
  searchLabel.innerText = `Displaying all episodes`

  loadEpisodeData(selectShows.value, true)
  // setTimeout(() => {

  // }, 1000)

  searchBox.addEventListener('keyup', doSearch)
  selectShows.addEventListener('change', filterShows)
  selectEpisode.addEventListener('change', filterEpisode)
}

////////// Create each episode block ///////////////
function createEpisodeBlock(episode, root) {
  const epDiv = document.createElement('div')
  const title = document.createElement('h3')
  const image = document.createElement('img')

  root.appendChild(epDiv)
  epDiv.appendChild(title)
  epDiv.appendChild(image)

  title.innerText = `${episode.name} - S${('0' + episode.season).slice(-2)}${(
    '0' + episode.number
  ).slice(-2)}`

  try {
    image.src = episode.image.medium
  } catch {
    image.src = 'img/notFound.jpg'
  }

  epDiv.id = 'episodeDiv'

  if (episode.summary === null) epDiv.innerHTML += ' '
  else epDiv.innerHTML += episode.summary

  epDiv.setAttribute('url', episode.url)

  epDiv.addEventListener('click', showEpisode)
}

////////Show episode in new window by url link /////////
function showEpisode(event) {
  let element = event.target
  let urlLink = ''

  if (element.hasAttribute('url')) urlLink = element.getAttribute('url')
  else urlLink = element.parentNode.getAttribute('url')

  window.open(urlLink)
}

///////// Function for select Episode ///////////
function filterEpisode(event) {
  const rootElem = document.getElementById('root')
  const search = document.getElementById('search')
  const searchLabel = document.getElementById('searchLabel')

  rootElem.innerHTML = ''
  search.value = ''
  const epList =
    event.target.value == 0
      ? allEpisodes
      : allEpisodes.filter((ep) => ep.id == event.target.value)

  epList.forEach((episode) => {
    createEpisodeBlock(episode, rootElem)
  })
  searchLabel.innerText =
    allEpisodes.length === epList.length
      ? `Displaying all episodes`
      : `Displaying ${epList.length}/${allEpisodes.length} episode(s)`
}

///////// Function for select Show ///////////
function filterShows(event) {
  const rootElem = document.getElementById('root')
  const search = document.getElementById('search')
  const searchLabel = document.getElementById('searchLabel')

  rootElem.innerHTML = ''
  search.value = ''
  loadEpisodeData(event.target.value)
  // setTimeout(() => {
  // }, 1000)
}

///////// Function for Search ///////////
function doSearch() {
  const rootElem = document.getElementById('root')
  const searchLabel = document.getElementById('searchLabel')
  const select = document.getElementById('selectEpisode')

  rootElem.innerHTML = ''
  select.selectedIndex = 0
  searchText = document.getElementById('search').value

  const epList = allEpisodes
    .filter((el) => el.summary != null)
    .filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchText.toLowerCase()) ||
        ep.summary.toLowerCase().includes(searchText.toLowerCase()),
    )

  epList.forEach((episode) => {
    createEpisodeBlock(episode, rootElem)
  })

  searchLabel.innerText =
    allEpisodes.length === epList.length
      ? `Displaying all episodes`
      : `Displaying ${epList.length}/${allEpisodes.length} episode(s)`
}

///////// Function To fill Episodes select with options ///////////
function createOptionsOfEpSelect(select, epList) {
  select.innerHTML = ''
  let op = document.createElement('option')
  op.value = '0'
  op.innerText = 'All episodes'
  select.appendChild(op)
  epList.forEach((ep) => {
    let op = document.createElement('option')
    op.value = ep.id
    op.innerText = `S${('0' + ep.season).slice(-2)}${('0' + ep.number).slice(
      -2,
    )} - ${ep.name}`
    select.appendChild(op)
  })
}

///////// Function To fill Shows select with options ///////////
function createOptionsOfShSelect(select, shList) {
  shList.forEach((sh) => {
    let op = document.createElement('option')
    op.value = sh.id
    op.innerText = sh.name
    select.appendChild(op)
  })
}

///////// Fetch episodes data from tv show site ///////////
function loadEpisodeData(episodeId, isFromMakePage) {
  const rootElem = document.getElementById('root')
  fetch(`https://api.tvmaze.com/shows/${episodeId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      if (isFromMakePage) {
        data.forEach((episode) => {
          createEpisodeBlock(episode, rootElem)
        })
        createOptionsOfEpSelect(selectEpisode, data)
      } else {
        createOptionsOfEpSelect(selectEpisode, data)
        data.forEach((episode) => {
          createEpisodeBlock(episode, rootElem)
        })
        searchLabel.innerText = `Displaying all episodes`
      }
      allEpisodes = data
    })
}

///////// Fetch shows images data from tv show site ///////////
function loadBannerData(headerImg) {
  let randomNumber = Math.floor(Math.random() * allShows.length + 1)
  if (
    allShows.filter((sh) => sh.id === randomNumber).length == 0 &&
    headerImg.src == ''
  )
    randomNumber = 1

  try {
    fetch(`https://api.tvmaze.com/shows/${randomNumber}/images`)
      .then((res) => res.json())
      .then((data) => {
        let urlLink = data
          .filter((obj) => obj.hasOwnProperty('resolutions'))
          .filter(
            (a) =>
              (a.type =
                'banner' &&
                a.main == false &&
                a.resolutions.original.height == 140 &&
                a.resolutions.original.url.length > 0),
          )
        if (urlLink[0].resolutions.original.url.length > 0)
          headerImg.src = urlLink[0].resolutions.original.url
      })
  } catch {
    randomNumber = 1
  }
}

window.onload = setup
