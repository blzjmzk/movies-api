const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Hello world"); //gdy odświeżymy stronę na porcie localhost:3000 wyświetli się Hello world
    res.end();
  }

  if (req.url === "/api/courses") {
    res.write(JSON.stringify([1, 2, 3]));
    res.end();
  }
});

sever.listen(3000);
