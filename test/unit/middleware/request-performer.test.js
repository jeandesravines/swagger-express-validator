const RequestPerformer = require('../../../lib/middleware/request-performer');
const Request = require('../mock/request');
const Response = require('../mock/response');

describe('middlware', () => {
  it('should fill response', () => {
    const res = new Response();
    const req = new Request({
      container: {
        handler: jest.fn().mockReturnValue('hello'),
      },
    });

    return RequestPerformer.handler(req, res)
      .then(() => {
        expect(req.response).toMatchObject({
          body: 'hello',
        });

        expect(req.container.handler).toHaveBeenCalledWith(req, res);
        expect(req.container.logger.debug).toHaveBeenCalled();
      });
  });

  it('should fill response with mandatory fields', () => {
    const res = new Response();
    const req = new Request({
      container: {
        handler: jest.fn().mockReturnValue({
          status: 200,
          body: 'hello',
        }),
      },
    });

    return RequestPerformer.handler(req, res)
      .then(() => {
        expect(req.response).toMatchObject({
          status: 200,
          body: 'hello',
        });

        expect(req.container.handler).toHaveBeenCalledWith(req, res);
        expect(req.container.logger.debug).toHaveBeenCalled();
      });
  });

  it('should fill response with additionnal fields', () => {
    const res = new Response();
    const req = new Request({
      container: {
        handler: jest.fn().mockReturnValue({
          body: 'hello',
          status: 200,
          location: 'http://localhost',
        }),
      },
    });

    return RequestPerformer.handler(req, res)
      .then(() => {
        expect(req.response).toMatchObject({
          body: {
            body: 'hello',
            status: 200,
            location: 'http://localhost',
          },
        });

        expect(req.container.handler).toHaveBeenCalledWith(req, res);
        expect(req.container.logger.debug).toHaveBeenCalled();
      });
  });
});
