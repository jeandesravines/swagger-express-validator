const sandbox = require('@jdes/jest-sandbox').create();
const SwaggerRouter = require('../../lib/middleware/router');
const Request = require('../mock/request');
const Response = require('../mock/response');

afterEach(() => {
  sandbox.restoreAllMocks();
});

describe('constructor', () => {
  it('set options and router', () => {
    const spySetDefaultRoutes = sandbox
      .spyOn(SwaggerRouter.prototype, 'setDefaultRoute')
      .mockReturnValue();

    const spySetRoutes = sandbox
      .spyOn(SwaggerRouter.prototype, 'setRoutes')
      .mockReturnValue();
    
    const router = new SwaggerRouter({
      swagger: {
        paths: {}
      },
      paths: {
        controllers: '/controllers',
      }
    });

    expect(typeof router.router).toBe('function');
    expect(router.swagger).toMatchObject({
      paths: {}
    });
    
    expect(router.paths).toMatchObject({
      controllers: '/controllers',
    });
    
    expect(spySetDefaultRoutes).toHaveBeenCalled();
    expect(spySetRoutes).toHaveBeenCalled();
  });
});