'use strict';

describe('Controller: UactrlCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var UactrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UactrlCtrl = $controller('UactrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UactrlCtrl.awesomeThings.length).toBe(3);
  });
});
