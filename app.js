"use strict";

var SwaggerExpress = require("swagger-express-mw");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

console.log(111, process.env.DATABASE_URL);
mongoose
  .connect(`${process.env.DATABASE_URL}`)
  .then(() => console.log("MongoDB connected…"))
  .catch(err => console.log(err));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }
  app.use(express.static("public"));

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths["/hello"]) {
    console.log(
      "try this:\ncurl http://127.0.0.1:" + port + "/hello?name=Scott"
    );
  }
});
