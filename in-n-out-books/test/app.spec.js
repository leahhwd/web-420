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

describe("Chapter 5: API Tests", () => {
  it("should update a book and return a 204 status code", async () =>{
    const res = await request(app).put("/api/books/1").send({
      title: "The night circus",
      author: "Erin Morgenstern"
    });
    expect(res.statusCode).toEqual(204);
  });

  it("should return a 400 status code when using a non-numeric id", async () => {
    const res = await request(app).put("/api/books/abd").send({
      title: "Test Book",
      author: "Dr. Test"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400 status code when updating a book with missing title", async () => {
    const res = await request(app).put("/api/books/1").send({
      author: "Dr. Test"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

  });
})

describe("Chapter 6: API tests", () => {
  it("should log a user in and return a 200-status with 'Authentication successful' message", async () => {
    const res = await request(app).post("/api/login").send({
      email: "harry@hogwarts.edu",
      password: "potter"
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");
  });

  it("should return a 401 status code with 'Unauthorized' when logging in with incorrect credentials", async () => {
    const res = await request(app).post("/api/login").send({
      email: "harry@hogwarts.edu",
      password: "granger"
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should return a 400 status code with 'Bad Request' when missing email or password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "harry@hogwarts.edu",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

});

describe("Chapter 7: API tests", () => {

  it("should return a 200 status code with 'Security questions successfully answered' message", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        {answer: "Hedwig"},
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ]
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Security questions successfully answered");
  });

  it("should return a 400 status code with 'Bad Request' message when the request body fails ajv validation", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        {answer: "Hedwig", question: "What is your pet's name?"},
        {answer: "Quidditch Through the Ages", myName: "Harry Potter"}
      ]
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 401 status code with 'Unauthorized' message when the security answers are incorrect", async () =>{
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        {answer: "Fluffy"},
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ]
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });
})