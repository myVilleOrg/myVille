'use strict';

describe('Controller: EdituaCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var EdituaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdituaCtrl = $controller('EdituaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdituaCtrl.awesomeThings.length).toBe(3);
  });
});
