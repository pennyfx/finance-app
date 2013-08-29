// export function for listening to the socket
var _ = require('lodash');

module.exports = function (socket, quotes) {

  var watchList = {};
  socket.emit('init', 'hello');

  socket.on('disconnect', function () {
    Object.keys(watchList).forEach(function(item){
      quotes.removeListener(item, quoteReceived);
      delete watchList[item];
    });
  });

  socket.on('subscribe', function(symbols){
    symbols = _.uniq((symbols || '').split(','));
    symbols.forEach(function(item){
      if (!watchList[item]){
        watchList[item] = true;
        quotes.addListener(item, quoteReceived);
      }
    })
  });

  socket.on('unsubscribe', function(symbol){
    if (watchList[symbol]){
      delete watchList[symbol];
      quotes.removeListener(symbol, quoteReceived);
    }
  });

  var quoteReceived = function(quote){
    socket.emit('quote', quote);
  }

};