
const socket = io();

let color = ''
let username = ''
let unread = 0;
let msgHistory = []
let historyCount = 0

window.onload = function() {

  color = new URLSearchParams(document.location.search).get('color')
  username = new URLSearchParams(document.location.search).get('pseudo')
  room = new URLSearchParams(document.location.search).get('room')
  window.localStorage.setItem('username', username)
  window.localStorage.setItem('color', color)


  document.getElementById("room-name").innerText= room
  document.getElementsByTagName('title')[0].innerText = room + ' | SocketChat'

  socket.emit('join-chat', {

    username: username,
    color: color,
    room: room,
  })
  
}

document.getElementById("msg-form").addEventListener('submit', (e) => {

  e.preventDefault();
  if(document.getElementById("msg-input").value !== ''){
    msgHistory.push(document.getElementById("msg-input").value)
    historyCount = 0;

      socket.emit('chat-msg', {
        content: document.getElementById("msg-input").value,
        author: new URLSearchParams(document.location.search).get('pseudo'),
        color: new URLSearchParams(document.location.search).get('color'),
        time: (new Date()).toLocaleTimeString(),
      })
      e.target.reset()
    }

});

document.getElementById("msg-input").addEventListener("keyup", (e) =>{
  e.preventDefault()
  if (e.key === 'ArrowUp') {
    console.log(msgHistory)
    historyCount = (historyCount == msgHistory.length) ? historyCount : historyCount + 1
    e.target.value = msgHistory[msgHistory.length - historyCount]
    console.log(historyCount)
  }
  if (e.key === 'ArrowDown') {
    console.log(msgHistory)
    if(historyCount > 1 ){

      historyCount = (historyCount == 1) ? 1 : historyCount - 1
      e.target.value = msgHistory[msgHistory.length - historyCount]
      console.log(historyCount)

    }
    else{
      e.target.value = ""
      historyCount = 0;
    }


  }

})

socket.on("msg", (message) =>{

  if (document.visibilityState === 'hidden')
  {
    beep('/audio/message-pop.wav', 0.3);
    unread++;
    document.getElementsByTagName('title')[0].innerText = '('+unread+') ' + room + ' | SocketChat'
  }

    const msg = createMessage(message)
    document.getElementById("msg-box").appendChild(msg)
    document.getElementById("msg-box").scrollTop = document.getElementById("msg-box").scrollHeight
})

socket.on("gif", (gif) => {

  if (document.visibilityState === 'hidden')
  {
    beep('/audio/message-pop.wav', 0.3);
    unread++;
    document.getElementsByTagName('title')[0].innerText = '('+unread+') ' + room + ' | SocketChat'
  }


  const gifMsg = document.createElement('div')
  const timestr = gif.time

  gifMsg.innerHTML = `
  <span>[${timestr}] </span>`

  const authorElem = document.createElement('b')
  authorElem.style.color = gif.color
  authorElem.innerText = gif.user + ' : '

  const gifElement = document.createElement('img');
  gifElement.src = gif.url
  gifElement.alt = gif.alt
  gifElement.title = gif.alt
  gifElement.classList.add('gif-chat-img')
  gifMsg.appendChild(authorElem)
  gifMsg.appendChild(gifElement)
  gifMsg.classList.add('message')
  gifMsg.classList.add('gif-message')


  document.getElementById("msg-box").appendChild(gifMsg)
  document.getElementById("msg-box").scrollTop = document.getElementById("msg-box").scrollHeight



})

socket.on("chatUsers", (users) =>{

  const membersBox = document.getElementById("members-box")
  membersBox.innerHTML = ''

  document.getElementById("online-count").innerText = users.length

  users.forEach(member => {

    const memberElem = document.createElement('div')
    memberElem.innerText = member.name
    memberElem.style.color = member.color
    membersBox.appendChild(memberElem)

  })


})



function createMessage(message){

  const msg = document.createElement('p')
  const timestr = message.time

  msg.innerHTML = `
  <span>[${timestr}] </span>`

  const authorElem = document.createElement('b')
  authorElem.style.color = message.color
  authorElem.innerText = message.author + ' : '

  const txtmsg = document.createElement('span');
  txtmsg.innerText=message.content
  msg.appendChild(authorElem)
  msg.appendChild(txtmsg)
  msg.classList.add('message')
  return msg

}


//DETECTER LA REOUVERTURE DE L'ONGLET
document.addEventListener("visibilitychange", function()
{
  if (document.visibilityState !== 'hidden')
  {
    unread = 0;
    document.getElementsByTagName('title')[0].innerText = room + ' | SocketChat'

  }
});

//BEEP NOTIFICATION
function beep(file,volume){
  var snd = new Audio(file);
  volume = volume ? volume : 0.5; // defaults to 50% volume level
  snd.volume = volume;

  // LISTENER: Rewind the playhead when play has ended
  snd.addEventListener('ended',function(){
      this.pause();
      this.currentTime=0;
  });

  // Play the sound
  snd.play();
}



//LIEN INVITATION

document.getElementById('invite-link').addEventListener('click',(e) =>{

  console.log('clic')
    const copyText = window.location.origin + '/invitation/' + new URLSearchParams(document.location.search).get('room');

    navigator.clipboard.writeText(copyText).then(function(){

      alert("Lien d'invitation copié : " + copyText);

    });

})