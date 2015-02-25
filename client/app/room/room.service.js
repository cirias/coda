'use strict';

angular.module('codaApp')
  .factory('Room', function ($resource) {
    return $resource('/api/rooms');
  });
