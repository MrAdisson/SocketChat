const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const emoji = require('node-emoji');

const dotenv = require('dotenv').config();


const BOTNAME = 'Chatb0t'

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: false}));

const PORT = 3000 || process.env.PORT;

//CONNEXION

let USERS = []

//CHAT SOCKET MANAGEMENT
io.on("connection", (socket) => {

  let currentuser = {}
  let room = ''
  socket.on("join-chat", (user) =>{
    
    const time = new Date();
    const connectiontime = time.toLocaleDateString() + " " + time.toLocaleTimeString();

    room = user.room
    socket.join(room)

    currentuser = {
      name: user.username,
      color: user.color,
      room: room
    }

    USERS.push(currentuser);
  

    console.log(connectiontime + " : " + currentuser.name + " a rejoint le salon " + room + " !");
    // console.log(currentuser)
    console.log("Utilisateurs du salon " + room + ' : ')
    console.log(USERS.reverse().filter(user => user.room === room))

    io.to(room).emit("chatUsers", USERS.reverse().filter(user => user.room === room))

    socket.emit("msg", {
      content:"Bienvenue sur le salon " + room + ', ' + currentuser.name + " !",
      author: BOTNAME,
      color: 'red',
      time: (new Date()).toLocaleTimeString(),
      });

    socket.broadcast.to(room).emit("msg", {
      content: `${currentuser.name} a rejoint le salon ${room}.`,
      author: BOTNAME,
      color: 'red',
      time: (new Date()).toLocaleTimeString(),
      });

    //DECONNEXION
    socket.on("disconnect", function () {
      socket.leave(room)  

      if (typeof currentuser !== "undefined" && currentuser !== null) {
        time = new Date();
        connectiontime = time.toLocaleDateString() + " " + time.toLocaleTimeString();
        console.log(connectiontime + " : " + currentuser.name + " déconnecté !");

        USERS.splice(USERS.indexOf(currentuser),1)
        
        io.to(room).emit("chatUsers", USERS.reverse().filter(user => user.room === room))

        socket.broadcast.to(room).emit("msg", {
          content: `${currentuser.name} a quitté le salon.`,
          author: BOTNAME,
          color: 'red',
          time: (new Date()).toLocaleTimeString(),
        });

      }

    });

    socket.on("chat-msg", (message) =>{

      message.content = emoji.emojify(message.content)
      io.to(room).emit("msg", message)

    })

    socket.on("gif-send", (gifobject) =>{

      console.log(gifobject)
      io.to(room).emit("gif", gifobject)
    })

  })

});

//ROUTES
app.get('/chat', (req, res) => {


  if (req.query.pseudo === '' || typeof req.query.pseudo === 'undefined') {
    res.redirect('/');
  }
  else{
    res.sendFile(path.join(__dirname,'/public/chat.html'))
  }

})

app.get('/invitation/:roomName', (req, res) => {


  res.sendFile(path.join(__dirname,'/pages/invitation.html'))

})



server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
