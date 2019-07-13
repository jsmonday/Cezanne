const express = require("express");
const app = express();
const port = 3150;

const testData = {
  title: "Functional Sentiment Analysis in JavaScript",
  description: "Writing a sentiment analyzer in modern and functional JavaScript using the AFINN dictionary, with an eye on clean code.",
  image: "https://images.unsplash.com/photo-1560092680-9a49173d6a4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
};

app.set("view engine", "pug")
  .set("views", `${__dirname}/templates`)
  .get("/openGraph", (_, res) => res.render("ogImage.pug", testData))
  .get("/instagram/post", (_, res) => res.render("instagramPost", testData))
  .listen(port, () => console.log(`Devserver live on http://localhost:${port}`));