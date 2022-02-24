//You can edit ALL of the code here

const allShows = getAllShows().sort((a, b) =>
  a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
)
var allEpisodes = loadEpisodeData(allShows[0].id)

function setup() {
  makePageForEpisodes()
}

function makePageForEpisodes() {
  const rootElem = document.getElementById('root')
  const header = document.createElement('header')
  const navbar = document.createElement('nav')
  const searchBox = document.createElement('input')
  const searchLabel = document.createElement('label')
  const selectEpisode = document.createElement('select')
  const selectShows = document.createElement('select')

  header.innerText = 'TV Show'

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

  loadEpisodeData(selectShows.value)
  setTimeout(() => {
    allEpisodes.forEach((episode) => {
      createEpisodeBlock(episode, rootElem)
    })
    createOptionsOfEpSelect(selectEpisode, allEpisodes)
  }, 1000)

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
  setTimeout(() => {
    createOptionsOfEpSelect(selectEpisode, allEpisodes)
    allEpisodes.forEach((episode) => {
      createEpisodeBlock(episode, rootElem)
    })
    searchLabel.innerText = `Displaying all episodes`
  }, 1000)
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
  // select.innerHTML = ''
  // let op = document.createElement('option')
  // op.value = '0'
  // op.innerText = 'All shows'
  // select.appendChild(op)
  shList.forEach((sh) => {
    let op = document.createElement('option')
    op.value = sh.id
    op.innerText = sh.name
    select.appendChild(op)
  })
}

///////// Fetch episodes data from tv show site ///////////
function loadEpisodeData(episodeId) {
  fetch(`https://api.tvmaze.com/shows/${episodeId}/episodes`)
    .then((res) => res.json())
    .then((data) => (allEpisodes = data))
}
window.onload = setup
