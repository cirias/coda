'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coda', {
      	abstract: true,
        url: '/coda',
        templateUrl: 'app/coda/coda.html',
        controller: 'CodaCtrl'
      });
  });