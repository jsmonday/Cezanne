const stream      = require("stream");
const puppeteer   = require("puppeteer");
const functions   = require('firebase-functions');
const uuidv4      = require('uuid/v4');
const firebase    = require("./src/firebase/storage");
const strapi      = require("./src/strapi");
                    require("dotenv").config();

function uploadImage({ id, template, target, buffer }) {

  return new Promise(async (resolve, reject) => {

    const collection = () => {
      return new Promise((resolve) => {
        if (template === 'instagram') {
          if (target === 'snippet') resolve({ fileName: 'instagramPost', collection: 'snippets' });
          if (target === 'article') resolve({ fileName: 'instagramPost', collection: 'articles' });
        }
    
        else if (template === 'opengraph') {
          if (target === 'snippet') resolve({ fileName: 'ogImage', collection: 'snippets' });
          if (target === 'article') resolve({ fileName: 'ogImage', collection: 'articles' });
        }
      })
    }

    const bufferStream       = new stream.PassThrough();
    const uuid               = uuidv4();
    const computedCollection = await collection();

    bufferStream.end(buffer);

    const bucket  = firebase.storage().bucket();
    const file    = bucket.file(`/${computedCollection.collection}/${id}/cezanne/${computedCollection.fileName}.png`);

    const options = {
      destination: `/${computedCollection.collection}/${id}/cezanne/${computedCollection.fileName}.png`,
      contentType: 'image/png',
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        }
      }
    }

    bufferStream
      .pipe(file.createWriteStream(options))
      .on('error', (error) => reject(error))
      .on('finish', async () => {
        const downloadPath = encodeURIComponent(`${computedCollection.collection}/${id}/cezanne/${computedCollection.fileName}.png`);
        const downloadUrl  = `${process.env.IMAGE_BASEURL}/${downloadPath}?alt=media&token=${uuid}`
        resolve(downloadUrl);
      });

  });
}

function b64(str) {
  const buff = Buffer.from(str);
  return buff.toString('base64');
}

function computeTemplate({ template, target }) {
  return new Promise((resolve) => {

    if (template === 'instagram') {
      resolve(`instagram/post/${target}`);
    }

    else if (template === 'opengraph') {
      resolve(`opengraph/${target}`);
    }

  })
}

function computeViewPort({template}) {
  return new Promise((resolve) => {
    if (template === 'opengraph') {
      resolve({ width: 1920, height: 1080 });
    }
  
    if (template === 'instagram') {
      resolve({ width: 1080, height: 1080 });
    }
  })
}

function computeQueryString({target, template, data}) {
  return new Promise((resolve) => {
    let qs;

    if (template === 'instagram') {
      if (target === 'snippet') qs = `code=${data.code}&lang=${data.lang}`;
      if (target === 'article') qs = `title=${data.title}&bgImage=${data.image}`;
    }

    else if (template === 'opengraph') {
      if (target === 'snippet') qs = `code=${data.code}&lang=${data.lang}`;
      if (target === 'article') qs = `title=${data.title}&bgImage=${data.image}&author=${data.author.name}&authorImg=${data.author.img}&role=${data.author.role}`;
    }

    resolve(qs);
  });
}

function generateImage({ template, target, data, params }) {
  return new Promise(async (resolve, reject) => {

    const viewPort   = await computeViewPort({template});
    const path       = await computeTemplate({template, target});
    const qs         = await computeQueryString({target, template, data});
    const remotePath = `${process.env.CEZANNE_PATH}/#/${path}?${qs}`;
    console.log(`SCREENSHOT PATH`, remotePath);
    const browser    = await puppeteer.launch({
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

    await page.goto(remotePath);
    await page.setViewport(viewPort);

    const renderedImage = await page.screenshot();
    await browser.close();

    const imageUrl = await uploadImage({ id: data.id, template, target, buffer: renderedImage });

    resolve(imageUrl);

  });
}

function getItemData(target, params) {
  return new Promise(async (resolve) => {
    if (target === 'article') {

      let remote = await strapi.getArticleById(params.id);

      resolve({
        id:          remote.id,
        title:       b64(remote.title),
        description: b64(remote.description),
        image:       b64(remote.image),
        author: {
          name:      b64(remote.author.name),
          desc:      b64(remote.author.desc),
          img:       b64(remote.author.img),
          role:      b64(remote.author.role)
        }
      })
    }

    else if (target === 'snippet') {

      let remote = await strapi.getSnippetById(params.id);

      resolve({
        id:   remote.id,
        code: b64(remote.code),
        lang: remote.lang
      })
    }
  })
}

async function getImages(params, target) {

  return new Promise(async (resolve, reject) => {
  
    const data  = await getItemData(target, params);
    const ogUrl = await generateImage({template: 'opengraph', target, data, params});
    const igUrl = await generateImage({template: 'instagram', target, data, params})

    if (target === 'snippet') {
      await strapi.updateStrapiSnippet({ 
        id: data.id, 
        data: {
          image_instagram_post: igUrl,
          image_opengraph:      ogUrl
      }})
    }

    if (target === 'article') {
      await strapi.updateStrapiArticle({ 
        id: data.id, 
        data: {
          og_image_url: ogUrl,
          ig_image_url: igUrl
      }})
    }

    resolve({ 
      opengraph: ogUrl,
      instagram: igUrl
    });

  });
}

exports.cezanne = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https
  .onRequest(async (req, res) => {

    const q      = req.body;
    const target = q.target;

    const { opengraph, instagram } = await getImages(q, target);

    res.json({ opengraph, instagram });
  });