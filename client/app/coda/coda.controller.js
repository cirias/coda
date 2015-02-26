'use strict';

angular.module('codaApp')
  .controller('CodaCtrl', function ($scope, $interval, $http, Room) {
    // var socket = io('/coda');
    $scope.init = function () {
    	$scope.socket = io();

    	$scope.rooms = Room.query(function () {

    	});

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
