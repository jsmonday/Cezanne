const axios     = require("axios");
const Strapi    = require("strapi-sdk-javascript").default;
                  require("dotenv").config();
const endpoint  = process.env.JSM_ENDPOINT;

const strapi = new Strapi(endpoint);

async function getJWT() {
  try {

    const { jwt } = await strapi.login(process.env.JSM_USERNAME, process.env.JSM_PASSWORD);
    return jwt;

  } catch (err) {
    console.log(err)
    console.log("Unable to get JWT");
  }
}

async function getArticleById(id) {
  try {

    const { data } = await axios.get(`${endpoint}/articles/${id}`);

    return {
      id,
      title:       data.title,
      description: data.subtitle,
      image:       data.cover_image_url,
      number:      id,
      author:      {
        name: data.author.full_name,
        desc: data.author.role,
        img:  data.author.profile_image_url,
        role: data.author.role
      }
    }

  } catch (err) {
    console.log(err);
  }
}

async function getSnippetById(id) {
  try {

    const { data } = await axios.get(`${endpoint}/snippets/${id}`);

    return {
      id,
      code: data.code,
      lang: data.language
    }

  } catch (err) {
    console.log(err);
  }
}

async function updateStrapiArticle({ id, data }) {
  try {

    const jwt = await getJWT();

    await axios({
      method: "put",
      url: `${endpoint}/articles/${id}`,
      headers: { Authorization: `Bearer ${jwt}` },
      data,
    });

    console.log(`Article ${id} successfully updated`);

  } catch (err) {
    console.log("Unable to update article " + id);
    console.log(err);
  }
}

async function updateStrapiSnippet({ id, data }) {
  try {

    const jwt = await getJWT();

    await axios({
      method: "put",
      url: `${endpoint}/snippets/${id}`,
      headers: { Authorization: `Bearer ${jwt}` },
      data
    });

    console.log(`Snippet ${id} successfully updated`);

  } catch (err) {
    console.log("Unable to update snippet " + id);
    console.log(err);
  }
}

module.exports = {
  getJWT,
  getArticleById,
  updateStrapiArticle,
  updateStrapiSnippet,
  getSnippetById
}