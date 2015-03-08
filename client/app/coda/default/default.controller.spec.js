'use strict';

describe('Controller: CodaDefaultCtrl', function () {

  // load the controller's module
  beforeEach(module('codaApp'));

  var CodaDefaultCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CodaDefaultCtrl = $controller('CodaDefaultCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
