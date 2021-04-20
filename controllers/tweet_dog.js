/**
 * A module to tweet when a dog is added to a shelter.
 * @module controllers/image_upload
 * @author Abdullaahi Farah
 * @see routes/* for dogs and users routes that use this module
 */

const { readFileSync } = require('fs');
const Twit = require('twit');
const model = require('../models/locations.js');
require('dotenv').config();

function tweetWithImage(twitter, status, image) {
	twitter.post('media/upload', { media_data: image }, (_err, data) => {
		const media = { media_id: data.media_id_string };
		twitter.post('media/metadata/create', media, (err) => {
			if (!err) {
				const params = { status, media_ids: media.media_id };
				twitter.post('statuses/update', params);
			}
		});
	});
}

/**
 * Koa middleware handler function to tweet about new dogs
 * @param {Object} ctx - The Koa request/response context object
 * @param {function} next - The Koa next callback
 * @throws {ValidationError} a jsonschema library exception
 */
async function tweetDog(ctx, next) {
	const twitter = new Twit({
		consumer_key: process.env.TWITTER_API_KEY,
		consumer_secret: process.env.TWITTER_SECRET_KEY,
		access_token: process.env.TWITTER_ACCESS_TOKEN,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	const result = await model.getById(ctx.state.user.locationID);
	if (result.length) {
		const { name } = ctx.request.body;
		const { name: location } = result[0];
		const status = `${name} has arrived at the ${location} shelter. Please come and adopt this beautiful dog.`;

		if (ctx.request.files && ctx.request.files.upload) {
			const { path } = ctx.request.files.upload;
			const image = readFileSync(path, { encoding: 'base64' });
			tweetWithImage(twitter, status, image);
		} else {
			twitter.post('statuses/update', { status });
		}
	}

	await next();
}

module.exports = tweetDog;
