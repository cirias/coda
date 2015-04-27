'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coda.game', {
        url: '/game/:id',
        templateUrl: 'app/coda/game/game.html',
        controller: 'CodaGameCtrl'
      });
  });
