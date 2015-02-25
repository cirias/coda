'use strict';

angular.module('codaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('setup', {
        url: '/setup',
        templateUrl: 'app/setup/setup.html',
        controller: 'SetupCtrl'
      });
  });