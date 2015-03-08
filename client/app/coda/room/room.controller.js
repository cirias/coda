'use strict';

angular.module('codaApp')
  .controller('CodaRoomCtrl', function ($scope, $cookies, $state, $stateParams, socketIo, Room) {
    $scope.$cookies = $cookies;
    $scope.room = Room.get({
      id: $stateParams.id
    }, function () {
      socketIo.on('player joined', function (player) {
        $scope.room = Room.get({
          id: $stateParams.id
        });
      });

      socketIo.on('player left', function (player) {
        $scope.room = Room.get({
          id: $stateParams.id
        });
      });

      socketIo.on('ready toggled', function (player) {
        $scope.$apply(function () {
          $scope.ready = player.ready;
        });
      });

      socketIo.on('other player toggled ready', function (player) {
        $scope.$apply(function () {
          $scope.room.players[player.id].ready = player.ready;
        });
      });

      socketIo.on('room left', function () {
        $state.go('coda.default');
      });

      socketIo.on('game start', function () {
        $state.go('coda.game');
      });
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
