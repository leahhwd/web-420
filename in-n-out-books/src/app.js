//Leah Harris
//6-14-24
//app.js for in-n-out-books app

//Set up express application
const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const createError = require("http-errors");
const users = require("../database/users");
const books = require("../database/books");
const Ajv = require("ajv");
const ajv = new Ajv();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Add Get route to return landing page
app.get("/", async(req, res, next)=> {
  //content
  const html = `

  <html>
  <head>
    <title>In-N-Out Books</title>
      <style>
      body, h1, h2 {margin: 0; padding: 0; border: 0;}
      body {
        background: #F0F8FF;
        font-size: 1.25rem;
      }
      h1 {
        color: #2F4F4F;
        font-family: 'Consolas';
        text-align: center;
      }
      h2, h4 {
        color: #b0544d;

      }
      h3 {
        color: #2F4F4F;
        text-decoration: underline;
      }
      .container {
        width: 100%;
        margin: 0 auto;
      }
      .container .header {
        text-align: center;
      }

      .container .book {
        text-align: left;
        border: 2px solid #192e2e;
        margin: 5px;
      }
      </style>
  </head>
  <body>
    <div class="container">
      <div class= "header">
        <h1>In-N-Out Books</h1>
        <h2>Organize and Manage All of Your Favorite Books!</h2>
      </div>

      <br>

      <main>
        <div class="book">
         <h3>To Kill a Mocking Bird</h3>
         <h4>Harper Lee</h4>
         <p>Follow Scout Finch as she learns about morality, empathy, and racial injustice during 1930 in the deep south.</p>
        </div>

        <div class="book">
         <h3>1984</h3>
         <h4>George Orwell</h4>
         <p>A dystopian novel depicting a totalitarian society where the government controls every aspect of life.</p>
        </div>

        <div class="book">
        <h3>The Alchemist</h3>
        <h4>Paulo Coelho</h4>
        <p>A philosophical novel following a young andalusian shepherd named Santiago.</p>
       </div>
      </main>
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

//Get route to return an array of books
app.get("/api/books", async(req, res, next) => {
  try {
    const allBooks = await books.find();
    console.log("all Books", allBooks);
    res.send(allBooks);
  }catch (err){
    console.error("Error: ", err.message);
    next(err);
  }
});

//Get route for /api/books/:id
app.get("/api/books/:id", async (req, res, next) => {
  try {
    let {id} = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    const book = await books.findOne({ id: Number(req.params.id)});

    console.log("Book: ", book);
    res.send(book);
  }catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

//Post route for /api/books
app.post("/api/books", async (req, res, next) => {
  try  {
    const newBook = req.body;
    const expectedKeys = ["id", "title", "author"];
    const recievedKeys = Object.keys(newBook);

    if(!recievedKeys.every(key=> expectedKeys.includes(key)) ||
    recievedKeys.length !== expectedKeys.length){
      console.error("Bad Request: Missing keys or extra keys", recievedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);
    console.log("Result: ", result);
    res.status(201).send({id: result.ops[0].id});
  }catch(err) {
    console.error("Error: ", err.message);
    next(err);
  }
});
//Delete endpoint
app.delete("/api/books/:id", async(req, res, next) => {
  try {
    const {id} = req.params;
    const result = await books.deleteOne({id: parseInt(id)});
    console.log("Result: ", result);
    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching item found") {
      return next(createError(404, "Book not found"));
    }
    console.error("Error: ", err.message);
    next(err);
  }
});
//Put endpoint
app.put("/api/books/:id", async (req, res, next) => {
  try {
    let {id} = req.params
    let book = req.body;
    id = parseInt(id);
    //Check if id isn't a number
    if(isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    //add validation to the put endpoint
    const expectedKeys = ["title", "author"];
    const receivedKeys = Object.keys(book);

//check required keys
    if (!receivedKeys.every(key => expectedKeys.includes(key)) ||
    receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }
    //update book and return 204 status code
    const result = await books.updateOne({id: id}, book);
    console.log("Result: ", result);
    res.status(204).send();
    //response for errors
  } catch (err) {
    if (err.message === "No matching item found") {
      console.log("Book not found", err.message)
      return next(createError(404, "Book not found"));
    }
    console.error("Error: ", err.message);
    next(err);
  }
});

//Post end Point for /api/login
app.post("/api/login", async (req, res, next) => {
  console.log("Request body", req.body);
  //test for missing parameter values
  try{
    const user = req.body;

    const expectedKeys = ["email", "password"];
    const receivedKeys = Object.keys(user);

    if(!receivedKeys.every(key => expectedKeys.includes(key)) ||
    receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing email or password", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    //find user and compare password
    let loginUser;
    try {
      loginUser = await users.findOne({email: user.email});
    } catch (err) {
      loginUser = null;
    }

    const result = bcrypt.compareSync(user.password, loginUser.password);

    if(result){
      res.status(200).send({ message: "Authentication successful"});
    } else {
      console.error("password is incorrect");
      return next(createError(401, "Unauthorized"));
    }

  } catch(err) {
    console.error("Error: ", err);
    console.error("Error: ", err.message);
    next(err);
  }
});

//Ajv JSON Schema Object to validate the request body
const securityQuestionsSchema = {
  type: "object",
  properties: {
    securityQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: {type: "string"}
        },
        required: ["answer"],
        additionalProperties: false
      }
    }
  },
  required: ["securityQuestions"],
  additionalProperties: false,
};

//Post endpoint for /api/users/verify-security-question
app.post("/api/users/:email/verify-security-question", async (req, res, next) => {
  try{
    const {securityQuestions} = req.body;
    const {email} = req.params;

    //use ajv to validate request body
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(req.body);

    if(!valid) {
      console.error("Bad Request: Invalid request body", validate.errors);
      return next(createError(400, "Bad Request"));
    }

    const user = await users.findOne({email: email});

    //Check if security questions match
    if(securityQuestions[0].answer !== user.securityQuestions[0].answer ||
       securityQuestions[1].answer !== user.securityQuestions[1].answer ||
       securityQuestions[2].answer !== user.securityQuestions[2].answer) {
         return next(createError(401, "Unauthorized"));
       } else {
         res.status(200).send({message: 'Security questions successfully answered', user: user});
       }

  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

//Middleware functions to handle errors
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
   type: 'error',
   status: err.status,
   message: err.message,
  });
});
//export the express application
module.exports = app;