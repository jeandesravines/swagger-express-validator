const ResponseValidator = require('../../../lib/middleware/response-validator');
const ResponseStatusError = require('../../../lib/error/validator/response-status-error');
const ResponseBodyError = require('../../../lib/error/validator/response-body-error');
const Request = require('../mock/request');

afterEach(() => {
  ResponseValidator.validators.clear();
});

describe('middleware', () => {
  test('should throw a ResponseStatusError', () => {
    const req = new Request({
      method: 'get',
      swagger: {
        pathName: 'persons',
        operation: {
          status: 200,
          responses: {
            200: {},
          },
        },
      },
      response: {
        status: 500,
      },
    });

    expect(() => ResponseValidator.handler(req))
      .toThrow(new ResponseStatusError(500));
  });

  test('should only set a status', () => {
    const req = new Request({
      method: 'get',
      swagger: {
        pathName: 'persons',
        operation: {
          status: 200,
          responses: {
            200: {},
          },
        },
      },
      response: {
        body: {},
      },
    });

    ResponseValidator.handler(req);

    expect(req.response.status).toBe(200);
  });

  test('should failed the validation', () => {
    const req = new Request({
      method: 'get',
      swagger: {
        pathName: 'persons',
        operation: {
          status: 200,
          responses: {
            200: {
              schema: {
                properties: {
                  name: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
      response: {
        body: {
          name: 'Jean',
        },
      },
    });

    expect(() => ResponseValidator.handler(req))
      .toThrow(new ResponseBodyError(
        expect.any(String), {
          name: 'Jean',
        }
      ));
  });

  test('should succeed the validation', () => {
    const req = new Request({
      method: 'get',
      swagger: {
        pathName: 'persons',
        operation: {
          status: 200,
          responses: {
            200: {
              schema: {
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      response: {
        body: {
          name: 'Jean',
        },
      },
    });

    ResponseValidator.handler(req);

    expect(req.response.status).toBe(200);
  });

  test('should succeed the validation twice', () => {
    const req = new Request({
      method: 'get',
      swagger: {
        pathName: 'persons',
        operation: {
          status: 200,
          responses: {
            200: {
              schema: {
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      response: {
        body: {
          name: 'Jean',
        },
      },
    });
    
    const spySet = jest.spyOn(ResponseValidator.validators, 'set');

    ResponseValidator.handler(req);
    ResponseValidator.handler(req);

    expect(req.response.status).toBe(200);
    expect(spySet).toHaveBeenCalledTimes(1);
  });
});