var storage = require('node-persist');

module.exports = function (io) {

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

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('hip found', function (data) {
    console.log("hipFound", data.id, data.msg);
    socket.broadcast.to(data.id).emit('hip match', data.msg);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log("DISCONNECT");
  });

  });
 }
