var app = require('express')(); //Used for loading in the html documents (static express features)
var http = require('http').createServer(app); //Creating Node Server
var io = require('socket.io')(http); //From socket IO tutorial - loads socket io
const mongoose = require('mongoose') // Using mongoose for MongoDB
const express = require('express') //Setting express
// connecting to database
app.use(express.static('css')) //Making CSS files accessible throughout application
app.use(express.static('images')) //Making Images files accessible throughout application

const url = 'mongodb://127.0.0.1:27017/applications' //Url for database

var bodyParser = require('body-parser'); //Parser to save the data entered in the form, from tutorial by Jennifer Bland
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url, {useNewUrlParser: true});

const db = mongoose.connection //connecting then if success printing in console if not showing if fails
db.once('open',_=> {console.log('Database Connected :', url)})

db.on('error', err => {console.error('connection error :',err)})

var formSchema = new mongoose.Schema({ //creating schema to save data from
  firstName: String,
  lastName: String,
  companyName: String,
  emailAddress: String
});

var User = mongoose.model("User", formSchema); // Creating model

//db.users.find()pretty() - The command to find the data in the database when in mongo console

app.post("/Submit", (req, res) => { // On submit saving information then redirecting to a thank you page
  var applications = new User(req.body);
  applications.save()
    .then(item => {
      res.sendFile(__dirname + "/html/formSubmit.html");
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
