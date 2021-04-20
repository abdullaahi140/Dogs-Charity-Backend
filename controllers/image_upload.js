/**
 * A module to upload images using file in the request data.
 * @module controllers/image_upload
 * @author Abdullaahi Farah
 * @see routes/* for dogs and users routes that use this module
 */

const { existsSync, mkdirSync, copyFileSync } = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

const imagesModel = require('../models/images.js');
const usersModel = require('../models/users.js');
const dogsModel = require('../models/dogs.js');

// creating upload directory if it doesn't exist
if (!existsSync('./tmp/api/uploads')) {
	mkdirSync('./tmp/api/uploads', { recursive: true });
}

/**
 * Koa middleware handler function to do image uploads
 * @param {Object} ctx - The Koa request/response context object
 * @param {function} next - The Koa next callback
 * @throws {ValidationError} a jsonschema library exception
 */
async function imageUpload(ctx) {
	// check if there's a file to upload
	if (ctx.request.files && ctx.request.files.upload) {
		// persistent location to save images
		const fileStore = 'var/tmp/api/public/images';
		const { path, type } = ctx.request.files.upload;
		const extension = mime.extension(type);
		const filename = `${uuidv4()}.${extension}`;
		const newPath = `${fileStore}/${filename}`;
		copyFileSync(path, newPath);

		const image = { filename, type };
		const result = await imagesModel.add(image);
		if (result.length) {
			const imageID = { imageID: result[0] };
			if (ctx.originalUrl.includes('users')) {
				await usersModel.update(ctx.body.ID, imageID);
			} else {
				await dogsModel.update(ctx.body.ID, imageID);
			}
			const links = `${ctx.protocol}://${ctx.request.header.host}/api/v1/images/${result[0]}`;
			ctx.body.links.image = links;
		}
	}
}

module.exports = imageUpload;
