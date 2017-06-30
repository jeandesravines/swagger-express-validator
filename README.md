# Swagger Express Validator

[![Build Status](https://travis-ci.org/jeandesravines/swagger-express-validator.svg)](https://travis-ci.org/jeandesravines/swagger-express-validator)
[![Coverage Status](https://coveralls.io/repos/github/jeandesravines/swagger-express-validator/badge.svg?branch=master)](https://coveralls.io/github/jeandesravines/swagger-express-validator?branch=master)

A Swagger validator and router for Express.js

## Table of contents

* [Setup](#setup)
* [API](#api)
* [Examples](#examples)


## Setup

```shell
npm install --save-dev @jdes/swagger-express-validator
```

## API 

### App.start(options: Object): Promise.<express.App>

Start the server.

#### Options

##### `app` An Express' app created with express()

* type: express.App
* required: false
* default: express()

Example:
```javascript
const app = express();
const options = {
  app: app@
};
```

##### `hooks` A list of middleware' hooks

A list of hook for every used middlewares:
* swaggerRouter: Get the right method for the current route
* requestHandler: Check parameters, and default response
* requestPerformer: Execute the controller's method with the `req`
* responseValidator: Validate the `req.response` with the associated schema
* responseSender: Get the `req.response` object and send it
* errorHandler: Error middleware


* type: `Object.<{before: Function, after: Function}>`
* required: false
* default: {}

Example:
```javascript
const options = {
  hooks: {
    requestHandler: {
      before: (req, res, next) => {
        console.log("Hello World!");
        next();
      }
    }
  }
};
```

##### `logger` A Logger

* type: winston.Logger
* required: false
* default: winston

Example: 
```javascript
const options ={
  logger: winston
};
```

##### `paths` The required paths

* type: Object.<string>
* required: true

Example:
```javascript
const options = {
  paths: {
    controllers: path.join(__dirname, "controller"),
    swagger: path.join(__dirname, "swagger", "swagger.json")
  }
};
```

### HttpError: Error

Parent class of the validator's errors.

## Sample

A sample is available to help ou to write your own app with swagger-express-validator.

## Examples

```javascript
const App = require("@jdes/swagger-express-validator").App;
const path = require("path");
const logger = require("winston");

const options = {
  logger,
  paths: {
    controllers: path.join(__dirname, "controller"),
    swagger: path.join(__dirname, "swagger", "swagger.json")
  }
};

App.start(options)
  .then((app) => {
    app.listen(8080, () => {
      logger.info(`Server launched on 8080`);
    });
  })
  .catch((error) => {
    logger.critical(error);
  });
```
