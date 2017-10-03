var storage = require('node-persist');

module.exports = function (io) {

  // Chatroom

  var numUsers = 0;

  getDate = function() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  return hour + ":" + min;
  }

  io.on('connection', (socket) => {
  var addedUser = false;

  console.log("user connected");

  socket.on('room', function(room) {
    console.log("socket joins room", room);
    socket.join(room);
  });

  // when the user disconnects.. perform this
  socket.on('remove', function (data) {

    console.log("REMOVE", data);
    let value = storage.getItemSync('locationKey');

    var locationArray = value.locations;
    console.log(locationArray);
    value.locations = locationArray.filter(function(i) {
    	return i.lat != data.lat;
    });

    storage.setItemSync('locationKey', value);

    socket.broadcast.to(data.id).emit('user left', "hip has left room");

  });

  socket.on('say to', function(data){
    console.log("say to", data.id, data.msg);
    socket.broadcast.to(data.id).emit('chat message', data.msg);
  });

    // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('hipFound', function (data) {
    console.log("hipFound", data.id, data.msg);
    socket.broadcast.to(data.id).emit('hipMatch', data.msg);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    console.log("typing");
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {

    console.log("DISCONNECT");

//    storage.setItemSync('locationKey', obj);
  /*  if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }*/
  });

  });
 }
