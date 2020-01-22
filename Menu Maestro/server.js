var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);




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
