'use strict';

angular.module('codaApp')
  .controller('CodaCtrl', function ($scope, $interval, $http, $document, Room) {
    // var socket = io('/coda');
    $scope.init = function () {
      $scope.socket = io();

      $scope.socket.on('set cookie', function (cookie) {
        document.cookie = cookie;
      });

      $scope.socket.on('room created', function () {
        $scope.rooms = Room.query();
      });

      $scope.rooms = Room.query();

      $interval(function () {
        $http.get('/heartbeat');
      }, 60000);
    };

    $scope.createRoom = function () {
      $scope.socket.emit('create room', $scope.params);
    };

    $scope.enterRoom = function (roomId) {
      $scope.socket.emit('join room', roomId);
    };
  });
