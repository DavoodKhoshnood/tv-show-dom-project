//You can edit ALL of the code here

const allEpisodes = getAllEpisodes()

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
  navbar.appendChild(selectEpisode)
  navbar.appendChild(searchBox)
  navbar.appendChild(searchLabel)

  createOptionsOfSelect(selectEpisode, allEpisodes)

  searchLabel.innerText = `Displaying all episodes`

  allEpisodes.forEach((episode) => {
    createEpisodeBlock(episode, rootElem)
  })

  searchBox.addEventListener('keyup', doSearch)
  selectEpisode.addEventListener('change', filterEpisode)
}

//Create each episode block
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

  image.src = episode.image.medium
  epDiv.id = 'episodeDiv'
  epDiv.innerHTML = epDiv.innerHTML + episode.summary
  epDiv.setAttribute('url', episode.url)

  ///  epDiv.addEventListener('click', showEpisode)
  epDiv.addEventListener('click', showEpisode)
}

//Show episode in new window by url link
function showEpisode(event) {
  let element = event.target
  let urlLink = ''

  if (element.hasAttribute('url')) urlLink = element.getAttribute('url')
  else urlLink = element.parentNode.getAttribute('url')

  window.open(urlLink)
}

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

function doSearch() {
  const rootElem = document.getElementById('root')
  const searchLabel = document.getElementById('searchLabel')
  const select = document.getElementById('selectEpisode')

  rootElem.innerHTML = ''
  select.selectedIndex = 0
  searchText = document.getElementById('search').value

  const epList = allEpisodes.filter(
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

function createOptionsOfSelect(select, showList) {
  let op = document.createElement('option')
  op.value = '0'
  op.innerText = 'All episodes'
  select.appendChild(op)
  showList.forEach((show) => {
    let op = document.createElement('option')
    op.value = show.id
    op.innerText = `S${('0' + show.season).slice(-2)}${(
      '0' + show.number
    ).slice(-2)} - ${show.name}`
    select.appendChild(op)
  })
}

window.onload = setup
