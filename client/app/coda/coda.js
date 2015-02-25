'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coda', {
        url: '/coda',
        templateUrl: 'app/coda/coda.html',
        controller: 'CodaCtrl'
      });
  });