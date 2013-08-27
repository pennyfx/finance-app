'use strict';

angular.module('angularAppsApp')
  .controller('MainCtrl', ['$scope', function ($scope, socket) {
    $scope.watchlist = [
      {
        name:'Google Inc',
        symbol: 'goog',
        last: 803.23,
        open: 802.20,
        high: 804.01,
        low: 802.10,
        diff: 1.23,
        ticks: [10,11,10,9,10,11,12,13,14,15,16,15,14,10,11,10,9,10,11,12,13,14,15,16,15,14]
      },
      {
        name:'Apple Inc',
        symbol: 'aapl',
        last: 333.23,
        open: 322.20,
        high: 327.01,
        low: 321.10,
        diff: 0.85,
        ticks: [10,11,10,9,10,11,12,13,14,15,16,15,14,10,11,10,9,10,11,12,13,14,15,16,15,14]
      }
    ];
    $scope.addItem = function(){
      $scope.watchlist.push({
        name:'Apple Inc',
        symbol: 'aapl',
        last: 333.23,
        open: 322.20,
        high: 327.01,
        low: 321.10,
        diff: 0.85,
        ticks: [10,11,10,9,10,11,12,13,14,15,16,15,14]
      });
    };
    $scope.sparkIt = function (){
        var ticks = this.symbol.ticks;

        ticks.push( ticks[ticks.length-1] + (Math.random() * 10 >= 5 ? 1 : -1) );
        this.symbol.ticks = ticks.slice(1);

    };

   /* socket.on('init', function (data) {
      console.log('socket init');
    });*/


  }]);
