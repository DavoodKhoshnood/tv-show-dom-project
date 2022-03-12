let allShows = []
let allEpisodes = []

const divShow = document.getElementById('showContainer')
const divEpisode = document.getElementById('episodeContainer')
const divRoot = document.getElementById('root')

const header = document.querySelector('header')
const headerImg = document.getElementById('headerImg')
const navbar = document.querySelector('nav')
const selectShows = document.getElementById('selectShows')
const selectEpisode = document.getElementById('selectEpisode')
const searchBox = document.getElementById('search')
const searchLabel = document.createElement('label')
const upBtn = document.createElement('div')
const backBtn = document.createElement('div')

//⟱⟱⟱⟱⟱⟱⟱⟱ Button to move up ⟱⟱⟱⟱⟱⟱⟱⟱

topAndBackBtnCreator()

function topAndBackBtnCreator() {
  divRoot.appendChild(upBtn)
  divRoot.appendChild(backBtn)

  upBtn.id = 'btnUp'
  upBtn.title = 'Go to top'
  upBtn.innerText = '⟰'

  backBtn.id = 'btnBack'
  backBtn.title = 'Back to Shows'
  backBtn.innerHTML = 'Back to Shows'

  backBtn.addEventListener('click', () => {
    setup()
  })

  upBtn.addEventListener('click', () => {
    document.documentElement.scrollTop = 0
  })

  window.onscroll = function () {
    scrollFunction()
  }

  function scrollFunction() {
    if (document.documentElement.scrollTop > 200) {
      upBtn.style.display = 'block'
    } else {
      upBtn.style.display = 'none'
    }
  }
}
//⟰⟰⟰⟰⟰⟰⟰⟰ Button to move up ⟰⟰⟰⟰⟰⟰⟰⟰

function setup() {
  displayChanger()
  loadShowsData()
  loadHeader()
}

///////// Fetch shows data from tv show site ///////////
function loadShowsData() {
  fetch(`https://api.tvmaze.com/shows`)
    .then((res) => res.json())
    .then((data) => {
      let newData = data.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? -1
          : 0,
      )
      allShows = newData
      newData.forEach((show) => {
        createShowBlock(show)
      })
      createOptionsOfShSelect()
    })
}

function createShowBlock(show) {
  const shDiv = document.createElement('div')
  const title = document.createElement('h1')
  const img = document.createElement('img')
  const summaryDiv = document.createElement('div')
  const details = document.createElement('div')

  divShow.appendChild(shDiv)
  shDiv.appendChild(title)
  shDiv.appendChild(img)

  shDiv.id = 'showDiv'
  details.id = 'details'
  let { name, summary, genres, status, rating, runtime, image } = show
  title.innerText = name

  try {
    img.src = image.medium
  } catch {
    img.src = 'img/notFound.jpg'
  }
  let more = ''
  if (summary.length > 400) {
    more = ` <a id='toggleButton' href="javascript:void(0);">more... </a>`
  }

  if (show.summary === null) summaryDiv.innerHtml = ' '
  else
    summaryDiv.innerHTML =
      '<p>' +
      summary.replace(/<p>/g, '').replace(/<\/p>/g, '').substring(0, 400) +
      '<span id="textArea">' +
      summary.replace(/<p>/g, '').replace(/<\/p>/g, '').slice(400) +
      '</span>' +
      '</p>' +
      more

  details.innerHTML = `<p><b>Rate:</b> ${rating.average}<br><b>Genres:</b> ${genres}<br><b>Status:</b> ${status}<br><b>Runtime:</b> ${runtime}</p>`
  shDiv.appendChild(summaryDiv)
  shDiv.appendChild(details)
  shDiv.setAttribute('showID', show.id)
  shDiv.setAttribute('url', show.url)
  shDiv.addEventListener('click', makePageForEpisodes)

  if (more.length > 0) {
    let tgl = document.getElementById('toggleButton')
    tgl.addEventListener('click', toggleText)
  }
}

//⟱⟱⟱⟱⟱⟱⟱⟱ Episodes ⟱⟱⟱⟱⟱⟱⟱⟱
function makePageForEpisodes(event) {
  if (event.target.id != 'toggleButton') {
    let show_ID = ''
    if (event.target.closest('#showDiv').hasAttribute('showID'))
      show_ID = event.target.closest('#showDiv').getAttribute('showID')

    displayChanger(false)

    selectShows.value = show_ID

    loadEpisodeData(show_ID)

    selectShows.addEventListener('change', filterShows)
    selectEpisode.addEventListener('change', filterEpisode)
  }
}

////////// Create each episode block ///////////////
function createEpisodeBlock(episode) {
  const epDiv = document.createElement('div')
  const title = document.createElement('h3')
  const image = document.createElement('img')

  divEpisode.appendChild(epDiv)
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
  else if (element.parentNode.hasAttribute('url'))
    urlLink = element.parentNode.getAttribute('url')

  window.open(urlLink)
}

///////// Function for select Episode ///////////
function filterEpisode(event) {
  divEpisode.innerHTML = ''
  search.value = ''
  const epList =
    event.target.value == 0
      ? allEpisodes
      : allEpisodes.filter((ep) => ep.id == event.target.value)

  epList.forEach((episode) => {
    createEpisodeBlock(episode)
  })
  searchLabel.innerText =
    allEpisodes.length === epList.length
      ? `Displaying all episodes`
      : `Displaying ${epList.length}/${allEpisodes.length} episode(s)`
}

///////// Function for select Show ///////////
function filterShows(event) {
  divShow.innerHTML = ''
  search.value = ''
  loadEpisodeData(event.target.value)
}

///////// Function for Search ///////////
function doSearch() {
  divEpisode.innerHTML = ''
  selectEpisode.selectedIndex = 0
  searchText = document.getElementById('search').value

  if (divShow.style.display != 'none') {
    divShow.innerHTML = ''
    const shList = allShows
      .filter((el) => el.summary != null)
      .filter(
        (sh) =>
          sh.name.toLowerCase().includes(searchText.toLowerCase()) ||
          sh.summary.toLowerCase().includes(searchText.toLowerCase()),
      )

    shList.forEach((show) => {
      createShowBlock(show)
    })

    searchLabel.innerText =
      allShows.length === shList.length
        ? `Displaying all shows`
        : `Displaying ${shList.length}/${allShows.length} show(s)`
  } else {
    const epList = allEpisodes
      .filter((el) => el.summary != null)
      .filter(
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
}

///////// Function To fill Episodes select with options ///////////
function createOptionsOfEpSelect() {
  selectEpisode.innerHTML = ''
  let op = document.createElement('option')
  op.value = '0'
  op.innerText = 'All episodes'
  selectEpisode.appendChild(op)
  allEpisodes.forEach((ep) => {
    let op = document.createElement('option')
    op.value = ep.id
    op.innerText = `S${('0' + ep.season).slice(-2)}${('0' + ep.number).slice(
      -2,
    )} - ${ep.name}`
    selectEpisode.appendChild(op)
  })
}

///////// Function To fill Shows select with options ///////////
function createOptionsOfShSelect() {
  allShows.forEach((sh) => {
    let op = document.createElement('option')
    op.value = sh.id
    op.id = sh.id
    op.innerText = sh.name
    selectShows.appendChild(op)
  })
}

///////// Fetch episodes data from tv show site ///////////
function loadEpisodeData(episodeId) {
  divEpisode.innerHTML = ''
  fetch(`https://api.tvmaze.com/shows/${episodeId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((episode) => {
        createEpisodeBlock(episode)
      })
      searchLabel.innerText = `Displaying all episodes`
      allEpisodes = data
      createOptionsOfEpSelect()
    })
}

///////// Fetch shows images data from tv show site ///////////
function loadBannerData() {
  var item = allShows[Math.floor(Math.random() * allShows.length)]
  let randomNumber = item.id
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
    randomNumber = 124
  }
}

function loadHeader() {
  setInterval(() => {
    loadBannerData()
  }, 3000)

  searchBox.addEventListener('keyup', doSearch)
  searchLabel.innerText = `Displaying all episodes`
}

function displayChanger(isShowsOn = true) {
  searchBox.value = ''
  divShow.style.display = isShowsOn ? 'block' : 'none'
  divEpisode.style.display = isShowsOn ? 'none' : 'flex'
  backBtn.style.display = isShowsOn ? 'none' : 'block'
  selectEpisode.style.display = isShowsOn ? 'none' : 'block'
  selectShows.style.display = isShowsOn ? 'none' : 'block'
}

let status = 'less'

function toggleText(event) {
  // let text = 'Here is some text that I want added to the HTML file'
  if (status == 'less') {
    document.getElementById('textArea').style.display = 'block'
    // document.getElementById('textArea').innerHTML += text
    document.getElementById('toggleButton').innerText = 'See Less'
    status = 'more'
  } else if (status == 'more') {
    document.getElementById('textArea').style.display = 'none'
    // document.getElementById('textArea').innerHTML = ''
    document.getElementById('toggleButton').innerText = 'See More'
    status = 'less'
  }
}
window.onload = setup
