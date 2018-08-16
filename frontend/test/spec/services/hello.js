'use strict';

describe('Service: hello', function () {

  // instantiate service
  var hello,
    init = function () {
      inject(function (_hello_) {
        hello = _hello_;
      });
    };

  // load the service's module
  beforeEach(module('appApp'));

  it('should do something', function () {
    init();

    expect(!!hello).toBe(true);
  });

  it('should be configurable', function () {
    module(function (helloProvider) {
      helloProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(hello.greet()).toEqual('Lorem ipsum');
  });

});
