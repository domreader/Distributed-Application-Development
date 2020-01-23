var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose')
const express = require('express')
// connecting to database
app.use(express.static('css'))
app.use(express.static('images'))

const url = 'mongodb://127.0.0.1:27017/applications'
const url1 = 'mongodb://127.0.0.1:27017/chat'

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url, {useNewUrlParser: true});


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url1, {useNewUrlParser: true});

const db = mongoose.connection
db.once('open',_=> {console.log('Database Connected :', url)})

db.on('error', err => {console.error('connection error :',err)})

db.once('open',_=> {console.log('Database Connected :', url1)})

db.on('error', err => {console.error('connection error :',err)})

var formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  emailAddress: String
});

var messageSchema = new mongoose.Schema({
  message : String
});


var User = mongoose.model("User", formSchema);
var Message = mongoose.model("message", messageSchema);

//db.users.find()pretty()

app.post("/Submit", (req, res) => {
  var applications = new User(req.body);
  applications.save()
    .then(item => {
      res.sendFile(__dirname + '/html/formSubmit.html');
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
app.get('formSubmit', function(request, response) {
  response.sendFile(__dirname + '/html/formSubmit.html');
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

var newMessage = new Message ({messageBody : msg});
newMessage.save(function(err)
{
  console.log("message is saved");
});
    io.emit('chat message', msg);
});

});

http.listen(9000, function(){
  console.log('listening on *:9000');
});
