'use strict';

describe('Service: Authentification', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Authentification;
  beforeEach(inject(function (_Authentification_) {
    Authentification = _Authentification_;
  }));

  it('should do something', function () {
    expect(!!Authentification).toBe(true);
  });

});
