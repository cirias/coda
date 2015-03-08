'use strict';

describe('Controller: CodaGameCtrl', function () {

  // load the controller's module
  beforeEach(module('codaApp'));

  var CodaGameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CodaGameCtrl = $controller('CodaGameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
