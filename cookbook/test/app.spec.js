//require statements for app.js and supertest
const app = require("../src/app");
const request = require("supertest");

//create a new test suite using jest describe method
describe("Chapter 3: API Tests", () => {
  it("it should return an array of recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
    });
  });

  it("it should return a single array", async () => {
    const res = await request(app).get("/api/recipes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name", "Pancakes");
    expect(res.body).toHaveProperty("ingredients", ["flour", "milk", "eggs"]);
  });

  it("should return a 400 error if the id isnt a number", async () => {
    const res = await request(app).get("/api/recipes/abc")
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

});

//create a new test suite for chapter 4
describe("Chapter 4: API Tests", () => {

  it("should return a 201 status code when adding a new recipe", async () => {
    const res = await request(app).post("/api/recipes").send({
      id: 99,
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"],
    });
    expect(res.statusCode).toEqual(201);
  });

  it("should return a 400 status code when adding a new recipe with missing name", async () => {
    const res = await request(app).post("/api/recipes").send({
      id: 100,
      ingredients: ["bread", "cheese", "butter"]
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 204 status code when deleting a recipe", async () => {
    const res = await request(app).delete("/api/recipes/99");

    expect(res.statusCode).toEqual(204);
  });
});

//new test suitw for chapter 5
describe("Chapter 5: API Tests", () => {
  it("should return a 204 status code when updateing a recipe", async () =>{
    const res = await request(app).put("/api/recipes/1").send({
      name: "Pancakes",
      ingredients: ["flour", "milk", "eggs", "sugar"]
    })
    expect(res.statusCode).toEqual(204);
  });

  it("should return a 400 status code when updating a recipe with a non-numeric id", async () => {
    const res = await request(app).put("/api/recipes/foo").send({
      name: "Test Recipe",
      ingredients: ["test", "test"]
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400 status code when updating a recipe with missing or extra keys", async () => {
    const res = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

    const res2 = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
      extraKey: "extra"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");
  });
});
