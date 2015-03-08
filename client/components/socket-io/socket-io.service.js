'use strict';

angular.module('codaApp')
  .factory('socketIo', function () {
  	var socketIo = io();
  	socketIo.on('set cookie', function (cookie) {
      document.cookie = cookie;
    });
    return socketIo;
  });
