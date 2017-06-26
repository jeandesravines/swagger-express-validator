const path = require("path");
const Sandbox = require("@jdes/jest-sandbox");
const SwaggerRouter = require("../../lib/middleware/swagger-router");
const NotFoundError = require("../../lib/error/common/not-found-error");

const Request = require("../mock/request");
const Response = require("../mock/response");

const sandbox = new Sandbox();

afterEach(() => {
  sandbox.restoreAllMocks();
});

describe("constructor", () => {
  test("set options and router", () => {
    const router = new SwaggerRouter({
      api: {
        basepath: "/"
      },
      paths: {
        controllers: "/controllers"
      }
    });

    expect(router.router).toEqual(expect.any(Function));
    expect(router.api).toMatchObject({
      basepath: "/"
    });

    expect(router.paths).toMatchObject({
      controllers: "/controllers",
    });
  });
});

describe("initialize", () => {
  test("calls initialization functions", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const spySetDefaultRoutes = jest
      .spyOn(router, "setDefaultRoute")
      .mockReturnValue();

    const spySetRoutes = jest
      .spyOn(router, "setRoutes")
      .mockReturnValue();

    router.initialize();

    expect(spySetDefaultRoutes).toHaveBeenCalled();
    expect(spySetRoutes).toHaveBeenCalled();
  });
});

describe("middleware", () => {
  test("return a router", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });
    
    expect(router.middleware).toBe(router.router);
  });
});

describe("defaultRouteMiddleware", () => {
  test("throw an error - no operation founded", () => {
    const next = jest.fn();
    const res = new Response();
    const req = new Request({
      path: "/hello",
      method: "get",
      swagger: {}
    });

    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    router.defaultRouteMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new NotFoundError("/hello", "get"));
  });

  test("bypass", () => {
    const next = jest.fn();
    const res = new Response();
    const req = new Request({
      swagger: {
        operation: {}
      }
    });

    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    router.defaultRouteMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("routeMiddleware", () => {
  test("should fill the request's container", () => {
    const next = jest.fn();
    const res = new Response();
    const req = new Request();

    const controller = {
      getAction: () => void 0
    };

    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    router.routeMiddleware(controller, controller.getAction, req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.app.locals.logger.debug).toHaveBeenCalled();
    expect(req.container).toMatchObject({
      handler: expect.any(Function),
      logger: req.app.locals.logger
    });
  });
});

describe("setDefaultRoute", () => {
  test("set a default route", () => {
    const req = new Request();
    const res = new Response();
    const next = () => void 0;
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const spyDefaultRouteMiddleware = jest.spyOn(router, "defaultRouteMiddleware")
      .mockReturnValue();

    const spyAll = jest.spyOn(router.router, "all")
      .mockImplementation((path, middleware) => {
        middleware(req, res, next);

        expect(spyDefaultRouteMiddleware)
          .toHaveBeenCalledWith(req, res, next);
      });

    router.setDefaultRoute();

    expect(spyAll).toHaveBeenCalledWith("*", expect.any(Function));
  });
});

describe("setRoute", () => {
  test("set a route", () => {
    const req = new Request();
    const res = new Response();
    const next = () => void 0;
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {
      getAction: () => void 0
    };

    const spyDefaultRouteMiddleware = jest.spyOn(router, "routeMiddleware")
      .mockReturnValue();

    const spyGet = jest.spyOn(router.router, "get")
      .mockImplementation((path, middleware) => {
        middleware(req, res, next);

        expect(spyDefaultRouteMiddleware)
          .toHaveBeenCalledWith(controller, controller.getAction, req, res, next);
      });

    router.setRoute("get", "/hello", controller, controller.getAction);

    expect(spyGet).toHaveBeenCalledWith("/hello", expect.any(Function));
  });
});

describe("setRouteForPath", () => {
  test("should do nothing - no valid verb", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {};
    const pathDefinition = {
      parameters: []
    };

    const spySetRoute = jest.spyOn(router, "setRoute");

    router.setRoutesForPath({
      controller,
      routePath: "/hello",
      pathDefinition
    });

    expect(spySetRoute).not.toHaveBeenCalledWith("/hello", );
  });

  test("should throw an error - undefined function", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {};
    const pathDefinition = {
      get: {}
    };

    const spySetRoute = jest.spyOn(router, "setRoute");
    const options = {
      controller,
      routePath: "/hello",
      pathDefinition
    };

    const error = new Error("Object.getAction(req, res) doesn't exists");

    expect(() => router.setRoutesForPath(options)).toThrow(error);
    expect(spySetRoute).not.toHaveBeenCalled();
  });

  test("set simple routes", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {
      getAction: () => void 0,
      postAction: () => void 0
    };

    const pathDefinition = {
      get: {},
      post: {}
    };

    const spySetRoute = jest.spyOn(router, "setRoute")
      .mockReturnValue();

    router.setRoutesForPath({
      controller,
      routePath: "/hello",
      pathDefinition
    });

    expect(spySetRoute.mock.calls).toEqual(
      expect.arrayContaining([
        ["get", "/hello", controller, controller.getAction],
        ["post", "/hello", controller, controller.postAction]
      ])
    );
  });

  test("set default parameters", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {
      getAction: () => void 0
    };

    const pathDefinition = {
      get: {}
    };

    const spySetRoute = jest.spyOn(router, "setRoute");

    router.setRoutesForPath({
      controller,
      routePath: "/hello",
      pathDefinition
    });

    expect(spySetRoute).toHaveBeenCalled();
    expect(pathDefinition.get.parameters).toEqual([]);
  });

  test("set definition parameters", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {
      getAction: () => void 0
    };

    const pathDefinition = {
      get: {},
      pathParameters: [{
        name: "userId",
        id: "query",
        type: "integer"
      }]
    };

    const spySetRoute = jest.spyOn(router, "setRoute");

    router.setRoutesForPath({
      controller,
      routePath: "/hello",
      pathDefinition
    });

    expect(spySetRoute).toHaveBeenCalled();
    expect(pathDefinition.get.parameters).toEqual(
      expect.arrayContaining([{
        name: "userId",
        id: "query",
        type: "integer"
      }]));
  });

  test("add definition parameters", () => {
    const router = new SwaggerRouter({
      api: {},
      paths: {}
    });

    const controller = {
      getAction: () => void 0
    };

    const pathDefinition = {
      get: {
        parameters: [{
          name: "id",
          id: "query",
          type: "integer"
        }]
      },
      pathParameters: [{
        name: "userId",
        id: "query",
        type: "integer"
      }]
    };

    const spySetRoute = jest.spyOn(router, "setRoute");

    router.setRoutesForPath({
      controller,
      routePath: "/hello",
      pathDefinition
    });

    expect(spySetRoute).toHaveBeenCalled();
    expect(pathDefinition.get.parameters).toEqual(
      expect.arrayContaining([{
        name: "userId",
        id: "query",
        type: "integer"
      }, {
        name: "id",
        id: "query",
        type: "integer"
      }]));
  });
});

describe("setRoutes", () => {
  test("should do nothing - no paths", () => {
    const router = new SwaggerRouter({
      paths: {},
      api: {
        paths: {}
      }
    });

    const spySetRoutesForPath = jest.spyOn(router, "setRoutesForPath")
      .mockReturnValue();

    router.setRoutes();

    expect(spySetRoutesForPath).not.toHaveBeenCalled();
  });

  test("should infer the controller by path's name", () => {
    const controllersPath = path.join(__dirname, "../../sample/controller");
    const paths = {
      controllers: controllersPath
    };

    const api = {
      basePath: "/api",
      paths: {
        "/contacts": {}
      }
    };

    const router = new SwaggerRouter({
      paths,
      api
    });

    const ContactsController = require(path.join(controllersPath, "contacts-controller"));
    const spySetRoutesForPath = jest.spyOn(router, "setRoutesForPath")
      .mockReturnValue();

    router.setRoutes();

    expect(spySetRoutesForPath).toHaveBeenCalledWith({
      controller: new ContactsController(),
      routePath: "/api/contacts",
      pathDefinition: {}
    });
  });

  test("should load with x-controller", () => {
    const controllersPath = path.join(__dirname, "../../sample/controller");
    const paths = {
      controllers: controllersPath
    };

    const api = {
      basePath: "/api",
      paths: {
        "/agenda": {
          "x-controller": "events"
        }
      }
    };

    const router = new SwaggerRouter({
      paths,
      api
    });

    const EventsController = require(path.join(controllersPath, "events-controller"));
    const spySetRoutesForPath = jest.spyOn(router, "setRoutesForPath")
      .mockReturnValue();

    router.setRoutes();

    expect(spySetRoutesForPath).toHaveBeenCalledWith({
      controller: new EventsController(),
      routePath: "/api/agenda",
      pathDefinition: {
        "x-controller": "events"
      }
    });
  });

  test("should set routes for paths", () => {
    const controllersPath = path.join(__dirname, "../../sample/controller");
    const paths = {
      controllers: controllersPath
    };

    const api = {
      basePath: "/api",
      paths: {
        "/contacts": {
          "x-controller": "contacts"
        },
        "/agenda": {
          "x-controller": "events"
        }
      }
    };

    const router = new SwaggerRouter({
      paths,
      api
    });

    const ContactsController = require(path.join(controllersPath, "contacts-controller"));
    const EventsController = require(path.join(controllersPath, "events-controller"));
    const spySetRoutesForPath = jest.spyOn(router, "setRoutesForPath")
      .mockReturnValue();

    router.setRoutes();

    expect(spySetRoutesForPath.mock.calls).toEqual(
      expect.arrayContaining([
        [{
          controller: new ContactsController(),
          routePath: "/api/contacts",
          pathDefinition: {
            "x-controller": "contacts"
          }
        }],
        [{
          controller: new EventsController(),
          routePath: "/api/agenda",
          pathDefinition: {
            "x-controller": "events"
          }
        }],
      ])
    );
  });
});