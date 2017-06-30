const { App } = require("../../lib"); // @jdes/swagger-express-validator
const logger = require("winston");
const { development, paths } = require("./configuration/configuration");

module.exports = App.start({
  development,
  logger,
  paths
});
