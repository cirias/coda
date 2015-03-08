'use strict';

angular.module('codaApp')
  .controller('CodaDefaultCtrl', function ($scope, $state, Room, socketIo) {
    $scope.init = function () {
      socketIo.on('room created', function (room) {
        $scope.rooms = Room.query();
      });

      socketIo.on('room destroied', function (room) {
        $scope.rooms = Room.query();
      });

      socketIo.on('room joined', function (room) {
        $state.go('coda.room', {
          id: room.id
        });
      });

      socketIo.on('fail', function (err) {
        console.error(err);
        $scope.loading = false;
      });

      $scope.rooms = Room.query();
    };

    $scope.createRoom = function () {
      $scope.loading = true;
      socketIo.emit('create room', $scope.params);
    };

    $scope.joinRoom = function (roomId) {
      $scope.loading = true;
      socketIo.emit('join room', roomId);
    };
  });
