const fortune = require("./fortune");

exports.home = (req, res) => {
  res.render("home");
};

exports.about = (req, res) => {
  res.render("about", { fortune: fortune.getFortune() });
};

//Niestandardowa strona 404
exports.notFound = (req, res) => {
  res.status(404);
  res.render("404");
};

//Niestandardowa strona 500
//Express rozpoznaje funkcję obsługi zdarzeń na podstawie czterech parametrów
//a zatem musimy wyłączyć regułę ESlint no-unused-vars

/*eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
};
/*eslint-enable no-unused-vars */
