'use strict';

angular.module('codaApp')
  .controller('CodaCtrl', function ($scope, Room) {
    // var socket = io('/coda');
    $scope.init = function () {
    	$scope.socket = io();

    	$scope.rooms = Room.query(function () {

    	});
    };

    $scope.createRoom = function () {
    	$scope.socket.emit('create room', $scope.params);
    }
  });
