const jwt = require("jsonwebtoken");
const config = require("config");

//next wykorzystujemy do przekazania kontroli do następnej middleware function po wykonaniu tej midldeware function
module.exports = function (req, res, next) {
  //zczytujemy token z req header i sprawdzamy czy istnieje
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  //sprawdzamy czy to właściwy token za pomocą private key
  //verify zwraca paylod w przypadku valid alb exception
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    //dodajemy payload do requestu
    //dzięki temu będziemy mogli mieć dostępn np. rq.user._id
    req.user = decoded;
    //przekazujemy kontrolę do następnego middleware, w tym przypadku route handlera
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
