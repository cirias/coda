'use strict';

angular.module('codaApp')
  .controller('SetupCtrl', function ($scope, $http, $state) {
    $scope.submit = function () {
    	$http.post('/setup', $scope.params).
    		success(function (data, status, headers, config) {
    			$state.go('coda');
    		}).
    		error(function (data, status, headers, config) {
    			console.error(data);
    		});
    };
  });
