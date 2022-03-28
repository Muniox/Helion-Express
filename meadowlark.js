const express = require("express");
const { create } = require("express-handlebars");
const fortune = require("./library/fortune");

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
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about", { fortune: fortune.getFortune() });
});

//app.use z bledami serwera zawsze ponizej trasowania!
//Niestandardowa strona 404
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

//Niestandardowa strona 500
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
});

app.listen(port, () => {
  console.log(`Express został uruchomiony pod adresem http://localhost:${port}`);
});
