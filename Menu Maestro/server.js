var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose')

// connecting to database

const url = 'mongodb://127.0.0.1:27017/messages'
mongoose.connect(url, {useNewUrlParser: true});

const db = mongoose.connection
db.once('open',_=> {console.log('Database Connected :', url)})

db.on('error', err => {console.error('connection error :',err)})


// sending the html files to the server to display

app.get('/index', function(req, res){
res.sendFile(__dirname + '/html/index.html');
});
app.get('/menu', function(request, response) {
  response.sendFile(__dirname + '/html/menu.html');
});
app.get('/chat', function(request, response) {
  response.sendFile(__dirname + '/html/chat.html');
});
app.get('/contact', function(request, response) {
  response.sendFile(__dirname + '/html/contact.html');
});

// From the Socket IO tutorial however adding for user disconnect

io.on('connection', function(socket){
  console.log('a user connected');
    io.emit('chat message', 'User Connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
      io.emit('chat message', 'User Disconnected');

  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(9000, function(){
  console.log('listening on *:9000');
});
