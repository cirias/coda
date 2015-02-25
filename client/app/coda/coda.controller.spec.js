'use strict';

describe('Controller: CodaCtrl', function () {

  // load the controller's module
  beforeEach(module('codaApp'));

  var CodaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CodaCtrl = $controller('CodaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
