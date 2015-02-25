'use strict';

angular.module('codaApp')
  .controller('CodaCtrl', function ($scope, Room) {
    // var socket = io('/coda');
    $scope.init = function () {
    	var socket = io('http://localhost:9000/coda');

    	$scope.rooms = Room.query(function () {

    	});
    };
  });
