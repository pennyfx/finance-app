'use strict';

angular.module('angularAppsApp')
  .controller('MainCtrl', ['$scope','socket', function ($scope, socket) {
    $scope.watchlist = [];
    $scope.newQuote = '';

    $scope.addItem = function(){
      console.log($scope.newQuote);
      addItem($scope.newQuote);
      socket.emit('subscribe', $scope.newQuote);
      $scope.newQuote = '';
    };

    $scope.remove = function(){
      removeItem(this.symbol.symbol);
    }

    socket.on('init', function (data) {
      $scope.watchlist = getWatchList();
      socket.emit('subscribe', $scope.watchlist.map(function(item){
        return item.symbol;
      }).join(','));
    });

    socket.on('quote', function(quote){
      var entry = findEntry(quote.symbol);
      if(entry){
        entry.last = quote.last;
        entry.high = quote.high;
        entry.low = quote.low;
        entry.diff = quote.diff;
        entry.ticks = quote.ticks;
        entry.deltaClass = getDeltaClass(quote.diff)

      }
    });

    function getDeltaClass(diff){
      if(diff > 0){
        if(diff < 1.0){
          return 'up1';
        }else if(diff <= 2.5){
          return 'up2';
        }else if(diff <= 5){
          return 'up3';
        }else if(diff > 5){
          return 'up4';
        }
      }
      else if(diff < 0){
        if(diff > -1.0){
          return 'dwn1';
        }else if(diff >= -2.5){
          return 'dwn2';
        }else if(diff >= -5){
          return 'dwn3';
        }else if(diff < -5){
          return 'dwn4';
        }
      }
      return '';
    }

    function findEntry(symbol){
      for(var i = 0; i < $scope.watchlist.length; i++){
        if($scope.watchlist[i].symbol == symbol){
          return $scope.watchlist[i];
        }
      }
    }

    var watchListKey = 'financeapp.watchlist';
    function getWatchList(){
      if (localStorage[watchListKey]){
        return JSON.parse(localStorage[watchListKey]);
      }
      else {
        localStorage[watchListKey] = [];
        return [];
      }
    }

    function addItem(symbol){
      $scope.watchlist.push({
        name: '',
        symbol: symbol,
        last: 0.0,
        open: 0.0,
        high: 0.0,
        low: 0.0,
        diff: 0.0,
        ticks: []
      });
      localStorage[watchListKey] = JSON.stringify($scope.watchlist);
    }

    function removeItem(symbol){
      $scope.watchlist = $scope.watchlist.filter(function(item){
        return item.symbol != symbol;
      });
      localStorage[watchListKey] = JSON.stringify($scope.watchlist);
      socket.emit('unsubscribe', symbol);
    }

}]);


