const sandbox = require('@jdes/jest-sandbox').create();
const Middleware = require('../../../lib/middleware/middleware');
const Request = require('../mock/request');
const Response = require('../mock/response');

afterEach(() => {
  sandbox.restoreAllMocks()
});

describe('middleware', () => {
  it('should resolves the default middleware', () => {
    const req = new Request();
    const res = new Response();
    const next = jest.fn();
    const spy = sandbox.spyOn(Middleware, "handler")
      .mockReturnValue();

    return Middleware.middleware(req, res, next)
      .then(() => {
        expect(spy).toHaveBeenCalledWith(req, res);
      });
  });

  it('should rejects the default middleware', () => {
    const req = new Request();
    const res = new Response();
    const next = jest.fn();
    
    sandbox.spyOn(Middleware, "handler")
      .mockImplementation(() => {
        throw new Error();
      });

    return Middleware.middleware(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
  });
});

describe('error', () => {
  it('should resolves the error middleware', () => {
    const req = new Request();
    const res = new Response();
    const err = new Error();
    const next = jest.fn();
    const spy = sandbox.spyOn(Middleware, "handler")
      .mockReturnValue();

    return Middleware.error(err, req, res, next)
      .then(() => {
        expect(spy).toHaveBeenCalledWith(err, req, res);
      });
  });

  it('should rejects the error middleware', () => {
    const req = new Request();
    const res = new Response();
    const err = new Error();
    const next = jest.fn();
    
    sandbox.spyOn(Middleware, "handler")
      .mockImplementation(() => {
        throw new Error();
      });

    return Middleware.error(err, req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
  });
});

describe('handler', () => {
  it('should throw an error', () => {
    expect(() => Middleware.handler())
      .toThrow(Error);
  });
});
