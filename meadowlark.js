"use strict";
const express = require("express");
const { create } = require("express-handlebars");
const handlers = require("./library/handlers");
const bodyParser = require("body-parser");

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

//wyłącza powered by express
app.disable("x-powered-by");

//dodanie plików statycznych
app.use(express.static(__dirname + "/public"));

//konfiguracja portu na którym nasłuchuje serwer
const port = process.env.PORT || 3000;

//trasowanie
app.get("/", handlers.home);

app.get("/about", handlers.about);

app.get("/headers", handlers.headers);

app.post("/process-contact", (req, res) => {
  console.log(
    `otrzymano dane kontaktowe od ${req.body.name} <${req.body.email}>`
  );
  res.redirect(303, "10-thank-you");
});
// app.get("/greeting", (req, res) => {
//   res.render("about", {
//     message: "Witaj, szanowny programisto",
//     style: req.query.style,
//     // userid: req.cookies.userid,
//     username: req.session.username,
//   });
// });

app.use(bodyParser.urlencoded({ extended: false }));

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
