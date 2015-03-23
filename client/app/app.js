'use strict';

angular.module('codaApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/coda');

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('httpInterceptor');
  });