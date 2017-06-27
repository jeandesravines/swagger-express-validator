const path = require("path");
const express = require("express");
const Sandbox = require("@jdes/jest-sandbox");
const SwaggerParser = require("swagger-parser")
const App = require("../../lib/service/app");
const SwaggerRouter = require('../../lib/middleware/swagger-router');

const sandbox = new Sandbox();

afterEach(() => {
  sandbox.restoreAllMocks();
});

describe("constructor", () => {
  test("should have default values", () => {
    const app = new App({
      paths: {
        controllers: "controller",
        swagger: "swagger/swagger.json"
      }
    });

    expect(app).toMatchObject({
      app: expect.any(Function),
      hooks: {},
      paths: {
        controllers: "controller",
        swagger: "swagger/swagger.json"
      }
    });

    expect(Object.keys(app.app)).toEqual(
      expect.arrayContaining(Object.keys(express()))
    );

    expect(app.logger.log).toEqual(expect.any(Function));
    expect(app.logger.debug).toEqual(expect.any(Function));
    expect(app.logger.info).toEqual(expect.any(Function));
    expect(app.logger.warn).toEqual(expect.any(Function));
    expect(app.logger.error).toEqual(expect.any(Function));
  });

  test("should have defined values", () => {
    const expressApp = express();
    const hooks = {
      swaggerRouter: {
        before: () => void 0
      }
    };

    const logger = {
      debug: () => void 0
    };

    const app = new App({
      app: expressApp,
      hooks,
      logger,
      paths: {}
    });

    expect(app).toMatchObject({
      app: expressApp,
      hooks,
      logger,
      paths: {}
    });
  });
});

describe("initializeApp", () => {
  test("should initialize app", () => {
    const app = new App({});

    app.initializeApp({
      swagger: "2.0",
      paths: {}
    });

    expect(app.api).toMatchObject({
      swagger: "2.0",
      paths: {}
    });

    expect(app.app.locals).toEqual(expect.any(Object));
    expect(app.app.locals).toMatchObject({
      api: app.api,
      logger: app.logger,
      settings: {
        "x-powered-by": false
      }
    });
  });
});

describe("initializerRouter", () => {
  test("initialize a SwaggerRouter", () => {
    const app = new App({
      paths: {
        swagger: "swagger/swagger.json"
      }
    });

    const spyRouterInitialize = sandbox
      .spyOn(SwaggerRouter.prototype, "initialize")
      .mockReturnValue();

    app.initializeApp({
      swagger: "2.0"
    });

    app.initializeRouter();

    expect(spyRouterInitialize).toHaveBeenCalled();
    expect(app.router).toBeInstanceOf(SwaggerRouter);
    expect(app.router).toMatchObject({
      paths: app.paths,
      api: app.api
    });
  });
});

describe("initializeMiddlewares", () => {
  test("should add middlewares", () => {
    const app = new App({});

    const spyUse = jest.spyOn(app.app, "use");
    const middlewares = {
      metadata: () => () => void 0,
      CORS: () => () => void 0,
      parseRequest: () => () => void 0,
      validateRequest: () => () => void 0,
    };

    sandbox
      .spyOn(SwaggerRouter.prototype, "initialize")
      .mockReturnValue();

    app.initializeApp({});
    app.initializeRouter();
    app.initializeMiddlewares(middlewares);
    
    expect(spyUse).toHaveBeenCalledTimes(10);
  });

  test("should add hooks", () => {
    const hooks = {
      swaggerRouter: {
        before: () => () => void 0,
        after: () => () => void 0
      }
    };

    const app = new App({
      hooks
    });

    const spyUse = jest.spyOn(app.app, "use");
    const middlewares = {
      metadata: () => () => void 0,
      CORS: () => () => void 0,
      parseRequest: () => () => void 0,
      validateRequest: () => () => void 0,
    };

    sandbox
      .spyOn(SwaggerRouter.prototype, "initialize")
      .mockReturnValue();

    app.initializeApp({});
    app.initializeRouter();
    app.initializeMiddlewares(middlewares);

    expect(spyUse).toHaveBeenCalledTimes(12);
  });
});

describe("initialize", () => {
  test("calls initializers", () => {
    const app = new App({});

    const spySwaggerParser = sandbox
      .spyOn(SwaggerParser, "validate")
      .mockReturnValue(Promise.resolve());

    const spyInitializeApp = jest
      .spyOn(app, "initializeApp")
      .mockReturnValue(Promise.resolve());

    const spyInitializeRouter = jest
      .spyOn(app, "initializeRouter")
      .mockReturnValue(Promise.resolve());

    const spyInitializeMiddlewares = jest
      .spyOn(app, "initializeMiddlewares")
      .mockReturnValue(Promise.resolve());

    const api = {
      swagger: "2.0"
    };

    const middlewares = {
      CORS: () => void 0
    };

    return app.initialize(middlewares, api)
      .then(() => {
        expect(spySwaggerParser).toHaveBeenCalledWith(api);
        expect(spyInitializeApp).toHaveBeenCalledWith(api);
        expect(spyInitializeRouter).toHaveBeenCalled();
        expect(spyInitializeMiddlewares).toHaveBeenCalledWith(middlewares);
      });
  });
});

describe("onCreateMiddleware", () => {
  test("should rejects", () => {
    const app = new App({});
    const spyInitialize = jest.spyOn(app, "initialize")
      .mockReturnValue(Promise.resolve());

    return expect(app.onCreateMiddleware(new Error()))
      .rejects.toEqual(new Error())
      .then(() => {
        expect(spyInitialize).not.toHaveBeenCalled();
      });
  });

  test("should resolves", () => {
    const app = new App({});
    const spyInitialize = jest.spyOn(app, "initialize")
      .mockReturnValue(Promise.resolve());

    const middleware = {
      metadata: () => void 0
    };

    const api = {
      swagger: "2.0"
    };

    return app.onCreateMiddleware(null, middleware, api)
      .then(() => {
        expect(spyInitialize).toHaveBeenCalledWith(
          middleware, api
        );
      });
  });
});

describe("start", () => {
  test("should calls onCreateMiddleware", () => {
    const app = new App({
      paths: {
        controllers: path.join(__dirname, "../../sample/controller"),
        swagger: path.join(__dirname, "../../sample/swagger/swagger.json")
      }
    });

    const spyOnCreateMiddleware = jest.spyOn(app, "onCreateMiddleware")
      .mockReturnValue(Promise.resolve());

    return app.start()
      .then(() => {
        expect(spyOnCreateMiddleware).toHaveBeenCalledWith(
          null,
          expect.objectContaining({
            metadata: expect.any(Function),
            CORS: expect.any(Function),
            parseRequest: expect.any(Function),
            validateRequest: expect.any(Function)
          }),
          expect.objectContaining({
            paths: expect.any(Object)
          })
        );
      });
  });
});

describe("static start", () => {
  test("should calls start", () => {
    const spyStart = sandbox.spyOn(App.prototype, "start")
      .mockReturnValue(Promise.resolve());

    const options = {
      paths: {}
    };

    return App.start(options)
      .then(() => {
        expect(spyStart).toHaveBeenCalled();
      });
  });
});