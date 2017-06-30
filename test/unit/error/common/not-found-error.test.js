const NotFoundError = require("../../../../lib/error/common/not-found-error");

describe("contructor", () => {
  it("set data", () => {
    const error = new NotFoundError({
      path: "/hello"
    });

    expect(error).toMatchObject({
      name: "NotFoundError",
      message: "Not found",
      status: 404,
      details: {
        path: "/hello"
      }
    })
  });
});