const stream    = require("stream");
const puppeteer = require("puppeteer");
const functions = require('firebase-functions');
const uuidv4    = require('uuid/v4');
const firebase  = require("./src/firebase/storage");
const strapi    = require("./src/strapi");
                  require("dotenv").config();

function uploadImage(id, template, target, buffer) {

  let fileName;

  let collection = () => {
    if (target === 'instagram') {
      if (template === 'snippet') return { fileName: 'instagramPost', collection: 'snippets' };
      if (template === 'article') return { fileName: 'instagramPost', collection: 'articles' };
    }

    else if (target === 'opengraph') {
      if (template === 'snippet') return { fileName: 'ogImage', collection: 'snippets' };
      if (template === 'article') return { fileName: 'ogImage', collection: 'articles' };
    }

  }

  return new Promise((resolve, reject) => {

    const bufferStream = new stream.PassThrough();
    const uuid = uuidv4();

    bufferStream.end(buffer);

    const bucket = firebase.storage().bucket();
    const file = bucket.file(`/${collection().collection}/${id}/cezanne/${collection().fileName}.jpg`);

    const options = {
      destination: `/${collection().collection}/${id}/cezanne/${collection().fileName}.jpg`,
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

function b64(str) {
  const buff = new Buffer(str);
  return buff.toString('base64');
}

function computeTemplate(template, target) {
  let path = [ template ];

  if (target === 'insagram') {
    path.push('post');
    path.push(target);
  }

  else if (target === 'opengraph') {
    path.push(target);
  }

  return path.join("/");
}

function computeViewPort(target) {
  if (target === 'opengraph') {
    return { width: 1920, height: 1080 };
  }

  if (target === 'instagram') {
    return { width: 1080, height: 1080 };
  }
}

function generateImage(template, target, data, params) {
  return new Promise(async (resolve, reject) => {

    const viewPort = computeViewPort(target);
    const path     = computeTemplate(template, target);
    const browser  = await puppeteer.launch({
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

    let qs;

    if (target === 'instagram') {
      if (template === 'snippet') qs = `?code=${data.code}&lang=${data.lang}`;
      if (template === 'article') qs = `?title=${data.title}&bgImage=${data.image}`;
    }

    else if (target === 'opengraph') {
      if (template === 'snippet') qs = `?code=${data.code}&lang=${data.lang}`;
      if (template === 'article') qs = `?title=${data.title}&bgImage=${data.image}&author=${data.author.name}&authorImg=${data.author.img}`;
    }

    const fullPath = `file://${__dirname}/src/react_templates/build/index.html/#/${path}${qs}`;

    console.log(`Rendering ${fullPath}`);

    await page.goto(fullPath);
    await page.setViewport(viewPort);

    const renderedImage = await page.screenshot();
    await browser.close();

    const imageUrl = await uploadImage(data.id, template, target, renderedImage);

    resolve({
      success: true,
      data: imageUrl
    });

  });
}

async function getImages(params, target) {

  return new Promise(async (resolve, reject) => {
  
    let data;

    if (target === 'article') {

      let remote = await strapi.getArticleById(params.id);

      data = {
        id:          remote.id,
        title:       b64(remote.title),
        description: b64(remote.description),
        image:       b64(remote.image),
        author: {
          name: b64(remote.author.name),
          desc: b64(remote.author.desc),
          img:  b64(remote.author.img)
        }
      }
    }

    else if (target === 'snippet') {
      let remote = await strapi.getSnippetById(params.id);

      data = {
        id:   remote.id,
        code: b64(remote.code),
        lang: remote.lang
      }
    }

    const [ opengraph, instagram ] = await Promise.all[ 
      generateImage('opengraph', target, data, params), 
      generateImage('instagram', target, data, params)
    ];

    resolve([ opengraph, instagram ]);

  });
}

exports.createImages = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .https
  .onRequest(async (req, res) => {

    const q      = req.body;
    const target = q.target;

    const [ opengraph, instagram ] = await getImages(q, target);

    res.json([ opengraph, instagram ]);
  });