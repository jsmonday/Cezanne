const pug       = require("pug");
const stream    = require("stream");
const puppeteer = require("puppeteer");
const functions = require('firebase-functions');
const uuidv4    = require('uuid/v4');
const firebase  = require("./src/firebase/storage");
const strapi    = require("./src/strapi");
                  require("dotenv").config();

function uploadImage(articleId, imageName, buffer) {
  return new Promise((resolve, reject) => {

    const bufferStream = new stream.PassThrough();
    const uuid = uuidv4();

    bufferStream.end(buffer);

    const bucket = firebase.storage().bucket();
    const file = bucket.file(`/articles/${articleId}/cezanne/${imageName}.jpg`);

    const options = {
      destination: `/articles/${articleId}/cezanne/${imageName}.jpg`,
      contentType: 'image/jpg',
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        }
      }
    }

    bufferStream
      .pipe(file.createWriteStream(options))
      .on('error', (error) => reject(error))
      .on('finish', () => {
        const downloadUrl = `${process.env.IMAGE_BASEURL}${articleId}%2Fcezanne%2F${imageName}.jpg?alt=media&token=${uuid}`
        resolve(downloadUrl);
      });

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
      title:       data.title,
      description: data.description,
      image:       data.image,
      number:      data.number,
      author:      data.author
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

      const imageUrl = await uploadImage(data.id, templateData.file, renderedImage)
      resolve({
        success: true,
        data: imageUrl
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

    if (q.target === 'article') {
      try {
  
        const articleData = await strapi.getArticleById(q.id);
  
        const [ 
          ogImage
          , igPost
          , igStory ] = await Promise.all([
              generateImage("ogImage",        articleData)
            , generateImage("instagramPost",  articleData)
          ]);
  
        const jwt = await strapi.getJWT();
        await strapi.updateOgGraphUrl(jwt, q.id, ogImage.data);
  
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
    }

    if (q.target === 'snippet') {
      try {
  
        const snippetData = await strapi.getSnippetById(q.id);
  
        const [ image_opengraph, image_instagram_post ] = await Promise.all([
              generateSnippetImage("ogImage",        snippetData)
            , generateSnippetImage("instagramPost",  snippetData)
          ]);
  
        const jwt = await strapi.getJWT();
        await strapi.updateStrapiSnippet(jwt, q.id, { image_instagram_post, image_opengraph });
  
        res.json({
          success: true,
          data: {
            image_opengraph,
            image_instagram_post
          }
        })
  
      } catch (err) {
        res.json({
          success: false,
          data: err
        })
      }
    }


  });