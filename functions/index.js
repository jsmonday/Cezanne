const pug = require("pug");
const stream = require("stream");
const puppeteer = require("puppeteer");
const functions = require('firebase-functions');
const firebase = require("./src/firebase/storage");

function uploadImage(articleId, imageName, buffer) {
  return new Promise((resolve, reject) => {

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const bucket = firebase.storage().bucket();
    const file = bucket.file(`/articles/${articleId}/${imageName}.jpg`);

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

function generateImage(template, data) {

  return new Promise(async (resolve, reject) => {
    let templateData;

    switch (template) {
      case "ogImage":
        templateData = { file: "ogImage", screenSize: { width: 1920, height: 1080 } };
        break;
      case "instagramPost":
        templateData = { file: "instagramPost", screenSize: { width: 1080, height: 1080 } };
        break;
      case "instagramStory":
        templateData = { file: "instagramStory", screenSize: { width: 1080, height: 1920 } };
        break;
    }

    const render = pug.renderFile(`./src/templates/${templateData.file}.pug`, {
      title: data.title,
      description: data.description,
      image: data.image,
      number: data.number
    })

    try {

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

      await page.setViewport({ ...templateData.screenSize });
      await page.setContent(render);
      const renderedImage = await page.screenshot();
      await browser.close();

      const imageUrl = await uploadImage(data.articleId, templateData.file, renderedImage)
      resolve({
        success: true,
        data: imageUrl[0]
      });

    } catch (err) {
      /* eslint-disable prefer-promise-reject-errors */
      reject({
        success: false,
        data: err
      });
    }
  });

}

exports.createImage = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https
  .onRequest(async (req, res) => {

    const q = req.body;

    if (!q.image || !q.title || !q.description || !q.articleId || !q.template) {
      res.json({
        success: false,
        data: "Missing required parameter: one of image, title, description, articleId, template"
      })
    }

    const validTemplates = ["instagramPost", "instagramStory", "ogImage", "all"];

    if (!validTemplates.includes(q.template)) {
      res.json({
        success: false,
        data: `${q.template} is not a valid template name. Must be one of: ${validTemplates.join(", ")}`
      })
    }

    if (q.template === "all") {

      try {

        const ogImage = await generateImage("ogImage", q);
        const igPost = await generateImage("instagramPost", q);
        const igStory = await generateImage("instagramStory", q);

        res.json({
          success: true,
          data: {
            openGraph: ogImage.data,
            instagram: {
              story: igStory.data,
              post: igPost.data
            }
          }
        })

      } catch (err) {
        res.json({
          success: false,
          data: err
        })
      }

    } else {

      generateImage(q.template, q)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))

    }

  });