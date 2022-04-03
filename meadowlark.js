"use strict";
const express = require("express");
const { create } = require("express-handlebars");
const handlers = require("./library/handlers");

const app = express();

//konfiguracja silnika widokow Handlebars
const hbs = create({
  helpers: {
    doctype() {
      return "<!DOCTYPE html>";
    },
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

//dodanie plików statycznych
app.use(express.static(__dirname + "/public"));

//konfiguracja portu na którym nasłuchuje serwer
const port = process.env.PORT || 3000;

//trasowanie
app.get("/", handlers.home);

app.get("/about", handlers.about);

//app.use z bledami serwera zawsze ponizej trasowania!
//Niestandardowa strona 404
app.use(handlers.notFound);

//Niestandardowa strona 500
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(
      `Express został uruchomiony pod adresem http://localhost:${port}`
    );
  });
} else {
  module.exports = app;
}
