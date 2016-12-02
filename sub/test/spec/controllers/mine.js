'use strict';

describe('Controller: MineCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var MineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MineCtrl = $controller('MineCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MineCtrl.awesomeThings.length).toBe(3);
  });
});
