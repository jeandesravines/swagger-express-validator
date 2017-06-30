const ResponseSender = require('../../../lib/middleware/response-sender');
const Request = require('../mock/request');
const Response = require('../mock/response');

describe('handler', () => {
  it('should fill the request with default values', () => {
    const res = new Response();
    const req = new Request({
      response: {},
    });

    ResponseSender.handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(void 0);
    expect(res.set).toHaveBeenCalledWith(void 0);
    expect(req.container.logger.debug).toHaveBeenCalled();
  });

  it('should fill the request', () => {
    const res = new Response();
    const req = new Request({
      response: {
        status: 400,
        headers: {
          'x-foo': 'bar',
        },
        body: {
          foo: 'bar',
        },
      },
    });

    ResponseSender.handler(req, res);

    expect(req.container.logger.debug).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      foo: 'bar',
    });

    expect(res.set).toHaveBeenCalledWith({
      'x-foo': 'bar',
    });
  });
});