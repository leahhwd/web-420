//Leah Harris
//6-14-24
//app.js for in-n-out-books app

//Set up express application
const express = require("express");
const createError = require("http-errors");

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
      h1, h2 {
        color: #2F4F4F;
        font-family: 'Consolas';
        text-align: center;
      }
      .container {
        width: 50%;
        margin: 0 auto;
      }
      </style>
  </head>
  <body>
    <div class="container">
      <header>
      <h1>In-N-Out Books</h1>
      <h2>Organize and Manage All of Your Favorite Books!</h2>
    </div>
  </body>
  </html>
  `;

  res.send(html);
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