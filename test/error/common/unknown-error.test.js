const UnknownError = require("../../../lib/error/common/unknown-error");

describe("contructor", () => {
  it("set data", () => {
    const error = new UnknownError({
        message: "An unknown error occurs"
    });

    expect(error).toMatchObject({
      name: "UnknownError",
      message: "Unknown error",
      status: 520,
      details: {
        message: "An unknown error occurs"
      }
    })
  });
});