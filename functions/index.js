const pug = require("pug");
const stream = require("stream");
const puppeteer = require("puppeteer");
const functions = require('firebase-functions');
const firebase = require("./src/firebase/storage");

function uploadImage(articleId, buffer) {
  return new Promise((resolve, reject) => {

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const bucket = firebase.storage().bucket();
    const file = bucket.file(`/articles/${articleId}/cover.jpg`);

    bufferStream
      .pipe(file.createWriteStream({ metadata: { contentType: 'image/png' } }))
      .on('error', (error) => reject(error))
      .on('finish', () => {
        file.getSignedUrl({ action: 'read', expires: '01-01-3000' })
          .then((url) => resolve(url))
          .catch((err) => reject(err));
      })

  });
}

exports.createImage = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https
  .onRequest(async (req, res) => {

    const q = req.body;

    if (!q.image || !q.title || !q.description || !q.articleId) {
      res.json({
        success: false,
        data: "Missing required parameter: one of image, title, description, articleId"
      })
    }

    const render = pug.renderFile("./src/templates/ogImage.pug", {
      title: q.title,
      description: q.description,
    })
      .replace("{{ image }}", q.image)

    const browser = await puppeteer.launch({
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(render);
    const renderedImage = await page.screenshot();
    await browser.close();

    try {
      const imageUrl = await uploadImage(q.articleId, renderedImage)
      res.json({
        success: true,
        data: imageUrl[0]
      });
    } catch (err) {
      res.json({
        success: false,
        data: err
      });
    }
  });