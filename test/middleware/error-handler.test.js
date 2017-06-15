const ErrorHandler = require('../../lib/middleware/error-handler');
const Request = require('../mock/request');
const Response = require('../mock/response');
const configuration = require('../../lib/configuration/configuration');
const backup = Object.assign({}, configuration);

afterEach(() => {
  Object.assign(configuration, backup);
});

describe('handler', () => {
  it('should trow the given error', () => {
    const err = new Error();
    const req = new Request();
    const res = new Response({
      headersSent: true
    });

    expect(() => ErrorHandler.handler(err, req, res)).toThrow(err);
    expect(req.container.logger.error).toHaveBeenCalled();
  });

  it('should set response - development=false, status=503', () => {
    const req = new Request();
    const res = new Response();
    const err = Object.assign(new Error(), {
      status: 503,
      code: 503000000,
      message: 'Temporarily unavailable',
      details: {
        path: '/hello'
      }
    });

    configuration.development = false;

    ErrorHandler.handler(err, req, res);

    expect(req.container.logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Temporarily unavailable'
    });
  });

  it('should set response - development=false, status=404', () => {
    const req = new Request();
    const res = new Response();
    const err = Object.assign(new Error(), {
      status: 404,
      message: 'Not found',
      details: {
        path: '/hello'
      }
    });

    configuration.development = false;

    ErrorHandler.handler(err, req, res);

    expect(req.container.logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Not found',
      name: 'Error',
      details: {
        path: '/hello'
      }
    });
  });

  it('should set response - development=true, err.stack=[]', () => {
    const req = new Request();
    const res = new Response();
    const err = Object.assign(new Error(), {
      status: 404,
      stack: [
        "0. Will be ignored",
        "1. Foo",
        "2. Bar"
      ].join('\n'),
      message: 'Not found',
      details: {
        path: '/hello'
      }
    });

    configuration.development = true;

    ErrorHandler.handler(err, req, res);

    expect(req.container.logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Not found',
      name: 'Error',
      details: {
        path: '/hello'
      },
      stack: [
        "1. Foo",
        "2. Bar"
      ]
    });
  });

  it('should set the default status', () => {
    const req = new Request();
    const res = new Response();
    const err = new Error();

    ErrorHandler.handler(err, req, res);

    expect(req.container.logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});