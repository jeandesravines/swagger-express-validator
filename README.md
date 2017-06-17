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

### HttpError: Error

Parent class of the validator's errors.

## Examples

```javascript
const App = require("@jdes/swagger-express-validator").App;
const path = require("path");
const logger = require("winston");

const options = {
  logger,
  paths: {
    controllers: path.join(__dirname, "controllers"),
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
