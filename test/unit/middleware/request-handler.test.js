const RequestHandler = require('../../../lib/middleware/request-handler');
const Request = require('../mock/request');

describe('middlware', () => {
  it('should set default status', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {},
            400: {},
          },
        },
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.container.logger.debug).toHaveBeenCalled();
  });

  it('should add no fields - no schema', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {},
          },
        },
      },
      query: {
        fields: ['name'],
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.container.logger.debug).toHaveBeenCalled();
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name'])
    );
  });

  it('should add no fields - no req.query.fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {},
            },
          },
        },
      },
      query: {
        fields: [],
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(expect.arrayContaining([]));
    expect(req.container.logger.debug).toHaveBeenCalled();
  });

  it('should add no fields - no fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {}
            },
          },
        },
      },
      query: {
        fields: ['name']
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name'])
    );
  });

  it('should add items\' fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {
                items: {
                  required: ['id']
                },
              },
            },
          },
        },
      },
      query: {
        fields: ['name']
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name', 'id'])
    );
  });

  it('should add schema\'s fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {
                required: ['uri']
              },
            },
          },
        },
      },
      query: {
        fields: ['name']
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name', 'uri'])
    );
  });

  it('should add all required fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {
                required: ['uri'],
                items: {
                  required: ['id'],
                },
              },
            },
          },
        },
      },
      query: {
        fields: ['name'],
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name', 'id', 'uri'])
    );
  });

  it('shouldn\'t add redundant fields', () => {
    const req = new Request({
      swagger: {
        operation: {
          responses: {
            200: {
              schema: {
                items: {
                  required: ['id'],
                },
              },
            },
          },
        },
      },
      query: {
        fields: ['name', 'id'],
      },
    });

    RequestHandler.handler(req);

    expect(req.swagger.operation.status).toBe('200');
    expect(req.query.fields).toEqual(
      expect.arrayContaining(['name', 'id'])
    );
  });
});