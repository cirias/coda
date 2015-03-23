'use strict';

angular.module('codaApp')
  .controller('CodaRoomCtrl', function ($scope, $cookies, $state, $stateParams, socketIo, Room) {
    $scope.$cookies = $cookies;
    $scope.room = Room.get({
      id: $stateParams.id
    }, function () {
      socketIo.on('player joined', function () {
        $scope.room = Room.get({
          id: $stateParams.id
        });
      });

      socketIo.on('player left', function () {
        $scope.room = Room.get({
          id: $stateParams.id
        });
      });

      socketIo.on('ready toggled', function (player) {
        player = CircularJSON.parse(player);
        console.log(player);
        $scope.$apply(function () {
          $scope.ready = player.ready;
        });
      });

      socketIo.on('other player toggled ready', function (player) {
        player = CircularJSON.parse(player);
        $scope.$apply(function () {
          $scope.room.players.filter(function (p) {
            return p.id === player.id;
          }).forEach(function (p) {
            p.ready = player.ready;
          });
        });
      });

      socketIo.on('room left', function () {
        $state.go('coda.default');
      });

      socketIo.on('game start', function () {
        $state.go('coda.game');
      });
    }, function (res) {
      switch (res.status) {
        case 403:
        case 404:
          $state.go('coda.default');
      }
    });

    $scope.init = function () {

    };

    $scope.leaveRoom = function () {
      socketIo.emit('leave room');
    };

    $scope.toggleReady = function () {
      socketIo.emit('toggle ready');
    };
  });
