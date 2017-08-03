const { App } = require("../../lib"); // @jdes/swagger-express-validator
const { paths, logLevel } = require("./configuration/configuration");

module.exports = App.start({
  logLevel,
  paths
});
