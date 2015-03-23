'use strict';

angular.module('codaApp')
  .factory('socketIo', function ($cookies) {
  	var socketIo = io();
    return socketIo;
  });
