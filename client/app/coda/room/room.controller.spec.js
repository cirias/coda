'use strict';

describe('Controller: CodaRoomCtrl', function () {

  // load the controller's module
  beforeEach(module('codaApp'));

  var CodaRoomCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CodaRoomCtrl = $controller('CodaRoomCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
