var http = require('http'),
  events = require('events'),
  util = require('util');

var internalEvents = ['newListener', 'removeListener'];

function QuoteManager(){
  var self = this,
    symbols = [];

  events.EventEmitter.call(this);

  this.on('newListener', function(type){
    if(~internalEvents.indexOf(type)) return;
    if (!~symbols.indexOf(type)){
      symbols.push(type);
    }
  });

  this.on('removeListener', function(type){
    if(~internalEvents.indexOf(type)) return;
    if (events.EventEmitter.listenerCount(self, type) == 0){
      var idx = symbols.indexOf(type);
      if(~idx) symbols.splice(idx,1);
    }
  });


  var cnt = 0;
  var dataStore = {
    'goog': {
      name: 'Google Inc.',
      symbol: 'goog',
      last: 801.0,
      open: 801.0,
      high: 801.0,
      low: 801.0,
      diff: 0.0,
      ticks: [10]
    },
    'prz': {
      name: 'Peta-Data Recovery Inc.',
      symbol: 'prz',
      last: 24.0,
      open: 24.0,
      high: 24.0,
      low: 24.0,
      diff: 0.0,
      ticks: [10]
    },
    'aapl': {
      name: 'Apple Inc.',
      symbol: 'aapl',
      last: 489.0,
      open: 489.0,
      high: 489.0,
      low: 489.0,
      diff: 0.0,
      ticks: [10]
    }
  };
  setInterval(function(){
    var sym = symbols[cnt++ % symbols.length];
    if (sym){
      var data = dataStore[sym];
      var diff = (Math.random() * 10 > 5 ? 1 : -1);
      var smallDiff = diff * .12;

      data.last = Math.round((data.last + smallDiff) * 100)/100;

      if (data.high < data.last){
        data.high = data.last;
      }
      if (data.low > data.last){
        data.low = data.last;
      }
      data.diff = Math.round(((data.last - data.open) / ((data.open + data.last) / 2)) * 10000) / 100;

      data.ticks.push( data.ticks[data.ticks.length-1] + diff );
      if (data.ticks.length > 25){
        data.ticks.splice(0,1);
      }
      self.emit(sym, data);
    }
  }, 100);

  return this;

};
util.inherits(QuoteManager, events.EventEmitter);


module.exports = QuoteManager;

