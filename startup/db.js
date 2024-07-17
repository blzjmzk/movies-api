const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logging");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db) //wczytujemy bazę w zaleznosci od środowiska, inną w testach inną w pozostałych
    .then(() => logger.info(`Connected to ${db}...`));
};
