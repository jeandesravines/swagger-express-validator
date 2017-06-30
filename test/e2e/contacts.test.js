const request = require("supertest");
let app;

beforeEach(() => {
  return require(process.cwd() + "/sample/lib")
    .then((server) => {
      app = server;
    });
});

describe("/", () => {
  test("GET", () => {
    return request(app)
      .get('/api/contacts')
      .expect(200)
      .expect("content-type", /json/)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });

  test("POST", () => {
    return request(app)
      .post('/api/contacts')
      .expect(201)
      .send({
        firstName: "Jean",
        lastName: "Desravines"
      })
      .then((response) => {
        expect(response.body).toEqual({});
        expect(response.headers).toMatchObject({
          location: expect.stringMatching(
            new RegExp("^/api/contacts/[\\w-]+$")
          )
        });
      })
      .then(() => request(app).get("/api/contacts"))
      .then((response) => {
        expect(response.body).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            firstName: "Jean",
            lastName: "Desravines"
          })
        ]);
      });
  });
});

describe("/:id", () => {
  let contact;

  beforeEach(() => {
    return request(app)
      .post("/api/contacts")
      .send({
        firstName: "Jean",
        lastName: "Desravines"
      })
      .then((response) => {
        return request(app)
          .get(response.headers.location);
      })
      .then((response) => {
        contact = response.body;
      });
  });

  test("GET", () => {
    return request(app)
      .get("/api/contacts/" + contact.id)
      .expect(200)
      .expect("content-type", /json/)
      .then((response) => {
        expect(response.body).toEqual(contact);
      });
  });

  test("PATCH", () => {
    return request(app)
      .patch("/api/contacts/" + contact.id)
      .expect(204)
      .send({
        id: "new-id",
        lastName: "Bar"
      })
      .then((response) => {
        expect(response.body).toEqual({});
      })
      .then(() => request(app).get("/api/contacts/" + contact.id))
      .then((response) => {
        expect(response.body).toEqual({
          id: contact.id,
          firstName: "Jean",
          lastName: "Bar"
        });
      });
  });

  test("PUT", () => {
    return request(app)
      .put("/api/contacts/" + contact.id)
      .expect(204)
      .send({
        id: "new-id",
        firstName: "Foo"
      })
      .then((response) => {
        expect(response.body).toEqual({});
        expect(response.headers).toMatchObject({
          location: `/api/contacts/${contact.id}`
        });
      })
      .then(() => request(app).get("/api/contacts/" + contact.id))
      .then((response) => {
        expect(response.body).toEqual({
          id: contact.id,
          firstName: "Foo"
        });
      });
  });

  test("DELETE", () => {
    return request(app)
      .delete("/api/contacts/" + contact.id)
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/contacts/" + contact.id)
          .expect(404);
      })
      .then(() => request(app).get("/api/contacts"))
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
});