const express = require("express");
const path = require("path");

const PORT = 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => console.log(`Server Listening on PORT : ${PORT}`));
