const HttpError = require("../../../../lib/error/common/http-error");

describe("contructor", () => {
  it("set data", () => {
    const error = new HttpError("Error message", {
      name: "CustomError",
      status: 404,
      details: {
        path: "/hello"
      }
    });
    
    expect(error).toMatchObject({
      name: "CustomError",
      message: "Error message",
      status: 404,
      details: {
        path: "/hello"
      }
    })
  });
});
