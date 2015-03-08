'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coda.room', {
        url: '/room/:id',
        templateUrl: 'app/coda/room/room.html',
        controller: 'CodaRoomCtrl'
      });
  });