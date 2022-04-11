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

//dodanie obsługi formularzy
app.use(bodyParser.urlencoded({ extended: false }));

//konfiguracja portu na którym nasłuchuje serwer
const port = process.env.PORT || 3000;

const tours = [
  { id: 0, name: "Hood River", price: 99.99 },
  { id: 1, name: "Oregon Coast", price: 149.95 },
];

//trasowanie
app.get("/", handlers.home);
app.get("/about", handlers.about);
app.get("/headers", handlers.headers);
app.post("/process-contact", (req, res) => {
  try {
    if (req.body.simulateError) throw new Error("Błąd zapisu kontaktu");
    console.log(
      `otrzymano dane kontaktowe od ${req.body.name} <${req.body.email}>`
    );
    res.format({
      "text/html": () => res.redirect(303, "/thank-you"),
      "application/json": () =>
        res.json({
          success: true,
        }),
    });
  } catch (err) {
    console.log(
      `błąd przetwarzania kontaktu od ${req.body.name} <${req.body.email}>`
    );
    res.format({
      "text/html": () => res.redirect(303, "/contact-error"),
      "application/json": () =>
        res.status(500).json({
          error: "błąd zapisu informacji kontaktowych",
        }),
    });
  }
});
app.get("/api/tours", (req, res) => {
  const toursXml =
    '<?xml version="1.0"?><tours>' +
    tours
      .map((p) => `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`)
      .join("") +
    "</tours>";
  const toursText = tours
    .map((p) => `${p.id}: ${p.name} (${p.price})`)
    .join("\n");
  res.format({
    "aplication/json": () => res.json(tours),
    "application/xml": () => res.type("aplication/xml").send(toursXml),
    "text/xml": () => res.type("text/xml").send(toursXml),
    "text/plain": () => res.type("text/plain").send(toursText),
  });
});

app.put("/api/tour/:id", (req, res) => {
  const p = tours.find((p) => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: "Nie istnieje taka wycieczka" });
  if (req.body.name) p.name = req.body.name;
  if (req.body.price) p.price = req.body.price;
  res.json({ success: true });
});

app.delete("/api/tour/:id", (req, res) => {
  const idx = tours.findIndex((tour) => tour.id === parseInt(req.params.id));
  if (idx < 0) return res.json({ error: "Nie istnieje taka wycieczka" });
  tours.splice(idx, 1);
  res.json({ success: true });
});

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
