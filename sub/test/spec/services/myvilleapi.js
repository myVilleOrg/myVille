'use strict';

describe('Service: myVilleAPI', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var myVilleAPI;
  beforeEach(inject(function (_myVilleAPI_) {
    myVilleAPI = _myVilleAPI_;
  }));

  it('should do something', function () {
    expect(!!myVilleAPI).toBe(true);
  });

});
