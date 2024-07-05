module.exports = function (err, req, res, next) {
  //+ log an error
  res.status(500).send("Something failed");
};
