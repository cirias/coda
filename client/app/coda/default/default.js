'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coda.default', {
        url: '',
        templateUrl: 'app/coda/default/default.html',
        controller: 'CodaDefaultCtrl'
      });
  });