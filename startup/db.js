const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db) //wczytujemy bazę w zaleznosci od środowiska, inną w testach inną w pozostałych
    .then(() => console.log(`Connected to ${db}`))
    .then(() => winston.info("Connected to MongoDB..."));
};
