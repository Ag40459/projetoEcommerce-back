const knex = require("../database/conection");

async function createImage(userId, url) {
  const newImage = {
    user_id: userId,
    url: url
  };
  const [image] = await knex('images').insert(newImage).returning(['id', 'user_id', 'url']);
  return image;
}

async function getImageById(imageId) {
  const [image] = await knex('images').where('id', imageId).select(['id', 'user_id', 'url']);
  return image;
}

async function getAllImages(userId) {
  const images = await knex('images').where('user_id', userId).select(['id', 'user_id', 'url']);
  return images;
}

async function updateImage(imageId, updates) {
  const [updatedImage] = await knex('images').where('id', imageId).update(updates).returning(['id', 'user_id', 'url']);
  return updatedImage;
}

async function deleteImage(imageId) {
  const [deletedImage] = await knex('images').where('id', imageId).del().returning(['id', 'user_id', 'url']);
  return deletedImage;
}

module.exports = {
  createImage,
  getImageById,
  getAllImages,
  updateImage,
  deleteImage
}