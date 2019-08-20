const express = require("express");
const app = express();
const port = 3150;

const testData = {
  title: "Functional Sentiment Analysis in JavaScript",
  description: "Writing a sentiment analyzer in modern and functional JavaScript using the AFINN dictionary, with an eye on clean code.",
  image: "https://firebasestorage.googleapis.com/v0/b/jsmonday-cms.appspot.com/o/articles%2F25%2Fcover.jpeg?alt=media&token=3b5bf48a-d20f-4e4b-af46-4adb57ae90d5",
  author: {
    name: "Michele Riva",
    desc: "Senior Software Engineer",
    img: "https://firebasestorage.googleapis.com/v0/b/jsmonday-cms.appspot.com/o/authors%2F1%2Fprofileimage.jpg?alt=media&token=249b03d1-4328-4b61-837f-a2d4205cd813"
  }
};

app.set("view engine", "pug")
  .set("views", `${__dirname}/templates`)
  .get("/openGraph", (_, res) => res.render("ogImage.pug", testData))
  .get("/instagram/post", (_, res) => res.render("instagramPost", testData))
  .get("/instagram/story", (_, res) => res.render("instagramStory", testData))
  .listen(port, () => console.log(`Devserver live on http://localhost:${port}`));