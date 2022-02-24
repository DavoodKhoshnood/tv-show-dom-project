//You can edit ALL of the code here

//const allEpisodes = getAllEpisodes()
const rootElem = document.getElementById('root')
loadData(1)

function loadData(episodeId) {
  //Load Shows Data to allShows
  fetch('https://api.tvmaze.com/shows')
    .then((res) => res.json())
    .then((data) => (allShows = data))

  //Load Episode Data to allEpisodes
  fetch(`https://api.tvmaze.com/shows/${episodeId}/episodes`)
    .then((res) => res.json())
    .then((data) => (allEpisodes = data))
}

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
  const selectShow = document.createElement('select')

  header.innerText = 'TV Show'

  searchBox.id = 'search'
  searchBox.type = 'text'
  searchBox.placeholder = 'Search'
  searchBox.autocomplete = 'off'

  searchLabel.for = 'search'
  searchLabel.id = 'searchLabel'

  selectEpisode.id = 'selectEpisode'
  selectShow.id = 'selectShow'

  document.body.appendChild(header)
  header.appendChild(navbar)
  navbar.appendChild(selectShow)
  navbar.appendChild(selectEpisode)
  navbar.appendChild(searchBox)
  navbar.appendChild(searchLabel)

  /* sort Shows select option alphabetically */
  const sortedAllShows = allShows.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
  )
  /* -------------------------------------- */

  createOptionsOfSelect(selectShow, sortedAllShows)
  createOptionsOfSelect(selectEpisode, allEpisodes)

  searchLabel.innerText = `Displaying all episodes`

  allEpisodes.forEach((episode) => {
    createEpisodeBlock(episode, rootElem)
  })

  searchBox.addEventListener('keyup', doSearch)
  selectShow.addEventListener('change', filterShows)
  selectEpisode.addEventListener('change', filterEpisodes)
}

//////// Create each episode block ///////
function createEpisodeBlock(episode) {
  const epDiv = document.createElement('div')
  const title = document.createElement('h3')
  const image = document.createElement('img')

  rootElem.appendChild(epDiv)
  epDiv.appendChild(title)
  epDiv.appendChild(image)

  title.innerText = `${episode.name} - S${('0' + episode.season).slice(-2)}${(
    '0' + episode.number
  ).slice(-2)}`

  image.src = episode.image.medium
  epDiv.id = 'episodeDiv'
  epDiv.innerHTML = epDiv.innerHTML + episode.summary
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
function filterEpisodes(event) {
  const search = document.getElementById('search')
  const searchLabel = document.getElementById('searchLabel')

  search.value = ''
  loadEpisodes(event.target.value)
}

function loadEpisodes(id) {
  rootElem.innerHTML = ''
  const epList = id == 0 ? allEpisodes : allEpisodes.filter((ep) => ep.id == id)

  epList.forEach((episode) => {
    createEpisodeBlock(episode)
  })
  searchLabel.innerText =
    allEpisodes.length === epList.length
      ? `Displaying all episodes`
      : `Displaying ${epList.length}/${allEpisodes.length} episode(s)`
}

function reloadSelectEpisode(epId) {
  loadData(epId)
  setTimeout(() => {
    selectEpisode.innerHTML = ''
    createOptionsOfSelect(selectEpisode, allEpisodes)
  }, 1000)

  setTimeout(() => {
    loadEpisodes(0)
  }, 1000)
}

///////// Function for select Show ///////////
function filterShows(event) {
  const search = document.getElementById('search')
  const searchLabel = document.getElementById('searchLabel')

  search.value = ''
  const epList = allEpisodes.filter((ep) => ep.id == event.target.value)

  reloadSelectEpisode(event.target.value)

  epList.forEach((episode) => {
    createEpisodeBlock(episode)
  })
  searchLabel.innerText = `Displaying all episodes`
}

///////// Function for Search ///////////
function doSearch() {
  const searchLabel = document.getElementById('searchLabel')
  const select = document.getElementById('selectEpisode')

  select.selectedIndex = 0
  searchText = document.getElementById('search').value
  rootElem.innerHTML = ''

  const epList = allEpisodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchText.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchText.toLowerCase()),
  )

  epList.forEach((episode) => {
    createEpisodeBlock(episode)
  })

  searchLabel.innerText =
    allEpisodes.length === epList.length
      ? `Displaying all episodes`
      : `Displaying ${epList.length}/${allEpisodes.length} episode(s)`
}

///////// Function To fill select with options ///////////
function createOptionsOfSelect(select, showList) {
  if (select === selectEpisode) {
    let op = document.createElement('option')
    op.value = '0'
    op.innerText = 'All episodes'
    select.appendChild(op)
  }
  showList.forEach((show) => {
    let op = document.createElement('option')
    op.value = show.id
    if (select == selectShow) op.innerText = show.name
    else
      op.innerText = `S${('0' + show.season).slice(-2)}${(
        '0' + show.number
      ).slice(-2)} - ${show.name}`

    select.appendChild(op)
  })
}

window.onload = setup
