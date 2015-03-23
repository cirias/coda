'use strict';

angular.module('codaApp')
  .factory('httpInterceptor', function ($q, $window) {
    return {
      'request': function(config) {
        if ($window.DEBUG) console.debug(config);
        return config;
      },

      'requestError': function(rejection) {
        // do something on error
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      },



      'response': function(response) {
        try {
          var data = CircularJSON.parse(response.data);
        } catch (err) {
          return response;
        }
        response.data = data;
        return response;
      },

      'responseError': function(rejection) {
        // do something on error
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      }
    };
  });