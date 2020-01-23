var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose')
const express = require('express')
// connecting to database
app.use(express.static('css'))
app.use(express.static('images'))

const url = 'mongodb://127.0.0.1:27017/messages'
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url, {useNewUrlParser: true});

const db = mongoose.connection
db.once('open',_=> {console.log('Database Connected :', url)})

db.on('error', err => {console.error('connection error :',err)})

var formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  emailAddress: String
});

var User = mongoose.model("User", formSchema);

//db.users.find()pretty()

app.post("/addname", (req, res) => {
  var messages = new User(req.body);
  messages.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});
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
app.get('/join', function(request, response) {
  response.sendFile(__dirname + '/html/join.html');
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
