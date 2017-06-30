const ResponseStatusError = require("../../../../lib/error/validator/response-status-error");

describe("contructor", () => {
  it("set data", () => {
    const error = new ResponseStatusError(404);

    expect(error).toMatchObject({
      name: "InternalError",
      message: "Internal error",
      status: 500,
      details: {
        status: 404
      }
    })
  });
});