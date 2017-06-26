const { App } = require("../lib"); // @jdes/swagger-express-validator
const logger = require("winston");
const { development, paths, port } = require("./configuration/configuration");
const options = {
  development,
  logger,
  paths
};

const deferred = App.start(options)
  .then((app) => new Promise((resolve, reject) => {
    app.listen(port, (error) => {
      error ? reject(error) : resolve();
    });
  }))
  .then(() => logger.info(`Server launched on ${port}`))
  .catch((error) => logger.error(error));

module.exports = deferred;
