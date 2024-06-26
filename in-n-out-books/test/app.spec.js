//require statements
const app = require("../src/app");
const request = require("supertest");

//Creating a test suite

describe("Week 4 API tests", () => {


  //test to return an array of books
  it("should return an array of many books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((books) => {
      expect(books).toHaveProperty("id");
      expect(books).toHaveProperty("title");
      expect(books).toHaveProperty("author");
    });
  });

  //test to return a single book
  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/3");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body).toHaveProperty("title", "The Two Towers");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");

  });

  //test for errors
  it("should return a 400 error if the id isnt a number", async () => {
    const res = await request(app).get("/api/books/xyz");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");

  });

})

describe("Chapter 4: API Tests", () => {

  //test for 201 status code
  it("should return a 201 status code when adding a new book", async () => {
    const res = await request(app).post("/api/books").send({
      id: 45,
      title: "The Name of the Wind",
      author: "Patrick Rothfuss"
    });
    expect(res.status).toEqual(201);
  });

  it("should return a 400 status code when adding a new book with missing title", async () => {
    const res = await request(app).post("/api/books").send({
      id: 43,
      author: "Yuval Noah Harari"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 204 status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/45");

    expect(res.statusCode).toEqual(204);
  });
})