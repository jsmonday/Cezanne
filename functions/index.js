const fs         = require("fs");
const puppeteer  = require("puppeteer");
const functions  = require('firebase-functions');


exports.createImage = functions
                      .runWith({ memory: '1GB' })
                      .https
                      .onRequest(async (req, res) => {

  const q = req.body;

  if (!q.image || !q.title || !q.description) {
    res.json({
      success: false,
      data: "Missing required parameter: one of image, title, description"
    })
  }
  
  const source = fs.readFileSync("./src/templates/ogImage.html", "utf8")
  const render = source.replace("{{ image }}",       q.image)
                       .replace("{{ title }}",       q.title)
                       .replace("{{ description }}", q.description)

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page    = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(render);
  const renderedImage = await page.screenshot();
  await browser.close();

  res.send(`<img src="data:image/png;base64, ${renderedImage.toString('base64')}" />`)

});