import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url == "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed");
  next();
};

app.use(logger);
app.use(privateMiddleware);

app.get("/", (req, res) => {
  return res.send("<h1>response test!</h1>");
});
app.get("/protected", (req, res) => {
  return res.send("protected PAGE");
});
app.get("/login", (req, res) => {
  return res.send("LOGIN PAGE");
});

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
