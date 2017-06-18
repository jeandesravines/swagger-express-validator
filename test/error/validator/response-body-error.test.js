const ResponseBodyError = require("../../../lib/error/validator/response-body-error");

describe("contructor", () => {
  it("set data", () => {
    const details = {
      error: "A property is required: id"
    };

    const body = {
      firstName: "Jean",
      lastName: "Desravies"
    };

    const error = new ResponseBodyError(details, body);

    expect(error).toMatchObject({
      name: "InternalError",
      message: "Internal error",
      status: 500,
      details: {
        error: "A property is required: id",
        body: {
          firstName: "Jean",
          lastName: "Desravies"
        }
      }
    })
  });
});