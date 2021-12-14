gifSearch = document.getElementById('gif-search')
const APIKEY = 'M96UVERPT24C'
const SEARCH_LIMIT = 32
// const username = new URLSearchParams(document.location.search).get('pseudo')


gifSearch.addEventListener('input', (e) =>{


    const gifBox = document.getElementById('gif-box')
    console.log(e.target.value)
    fetch(`https://g.tenor.com/v1/search?q=${e.target.value}&key=${APIKEY}&limit=${SEARCH_LIMIT}`)
    .then((response) => response.json())
    .then(data => {
        gifBox.innerHTML = ''

        data.results.forEach(gif =>{
            console.log(gif)
            console.log(gif.media[0].tinygif)

            let gifElem = document.createElement('img')
            gifElem.src = gif.media[0].tinygif.url
            gifElem.alt = gif.content_description
            gifElem.title = gif.content_description
            gifElem.id = gif.id
            gifElem.classList.add('gif-elem')
            gifElem.style.maxHeight = '100px'

            gifElem.addEventListener('click', (e) => {

                socket.emit('gif-send', {

                    user: username,
                    alt:  gifElem.alt,
                    url: gif.media[0].gif.url,
                    color: new URLSearchParams(document.location.search).get('color'),
                    time: (new Date()).toLocaleTimeString()

                })

                document.getElementById('gif-modal').style = 'display:none'
                document.getElementById('blocker').style = 'display:none';


            })
            gifBox.appendChild(gifElem)

        })

    })

})
document.getElementById('blocker').addEventListener('click', (e) => {
    document.getElementById('blocker').style = 'display:none';
    document.getElementById('gif-modal').style = 'display:none'
})

document.getElementById('gif-btn').addEventListener('click', (e) =>{


    const gifBox = document.getElementById('gif-box')

    document.getElementById('blocker').style = 'display:flex';

    document.getElementById('gif-modal').style = 'display:flex'
    document.getElementById('gif-search').focus()
    fetch(`https://g.tenor.com/v1/search?q=&key=${APIKEY}&limit=${SEARCH_LIMIT}`)
    .then((response) => response.json())
    .then(data => {
        gifBox.innerHTML = ''

        data.results.forEach(gif =>{
            console.log(gif)
            console.log(gif.media[0].tinygif)

            let gifElem = document.createElement('img')
            gifElem.src = gif.media[0].tinygif.url
            gifElem.alt = gif.content_description
            gifElem.title = gif.content_description

            gifElem.classList.add('gif-elem')
            gifElem.style.maxHeight = '100px'
            gifElem.addEventListener('click', (e) => {

                socket.emit('gif-send', {

                    user: username,
                    alt:  gifElem.alt,
                    url: gif.media[0].gif.url,
                    color: new URLSearchParams(document.location.search).get('color'),
                    time: (new Date()).toLocaleTimeString()

                })


                document.getElementById('gif-modal').style = 'display:none'
                document.getElementById('blocker').style = 'display:none';

            })
            gifBox.appendChild(gifElem)

        })

    })
})