// export function for listening to the socket
module.exports = function (socket) {
  console.log('connected');
  socket.emit('init', 'hello');

  socket.on('test', function(data){
    console.log('test', data);
  });

  socket.on('disconnect', function () {
    console.log('left');
  });
};