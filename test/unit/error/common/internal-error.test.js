const InternalError = require("../../../../lib/error/common/internal-error");

describe("contructor", () => {
  it("set data", () => {
    const error = new InternalError({
      message: "An error occurs"
    });

    expect(error).toMatchObject({
      name: "InternalError",
      message: "Internal error",
      status: 500,
      details: {
        message: "An error occurs"
      }
    })
  });
});