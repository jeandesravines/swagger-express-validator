const { port } = require("./lib/configuration/configuration");
const deferred = require("./lib");

deferred
  .then((app) => new Promise((resolve, reject) => {
    app.listen(port, (error) => {
      error ? reject(error) : resolve(app);
    });
  }))
  .then((app) => {
    app.locals.logger.info(`Server launched on ${port}`);
  })
  .catch((error) => {
    throw error;
  });
