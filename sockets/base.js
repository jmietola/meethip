var storage = require('node-persist');

module.exports = function (io) {

  io.on('connection', (socket) => {
  var addedUser = false;

  console.log("user connected");

  socket.on('room', function(room) {
    console.log("socket joins room", room);
    socket.join(room);
  });



  });
 }
