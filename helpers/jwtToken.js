/**
 * A module used to create JWTs for user authentication.
 * @module helpers/jwtToken
 * @author Abdullaahi Farah
 * @see helpers/* for other helper functions
 */

const jwt = require('jsonwebtoken');
const model = require('../models/users.js');
require('dotenv').config();

// Part of the object to be signed as JWT
const payload = {
	iss: process.env.SERVER_NAME,
	aud: '600CEM SPA'
};

/**
 * Function to generate an access token for the authenticated user.
 * @param {number} ID - The ID of the user
 * @param {Object} username - The username of the user
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Object} - A signed JWT access token and the expiry time
 */
exports.genJwtAccessToken = async function genJwtAccessToken(ID, username, provider = 'internal') {
	payload.sub = ID;
	payload.name = username;
	payload.provider = provider;
	const expire = 600; // 10 min expiry
	const accessToken = {
		token: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' }),
		expiresIn: expire
	};
	return accessToken;
};

/**
 * Function to generate a refresh token for the authenticated user.
 * @param {number} ID - The ID of the user
 * @param {Object} username - The username of the user
 * @param {string} provider - The provider of the account e.g. 'google', 'internal'
 * @returns {Object} - A signed JWT refresh token
 */
exports.genJwtRefreshToken = async function genJwtRefreshToken(ID, username, provider = 'internal') {
	payload.sub = ID;
	payload.name = username;
	payload.provider = provider;
	const expire = 1209600; // 14 day expiry
	const refreshToken = {
		userID: ID,
		token: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
		expiresIn: expire
	};
	return refreshToken;
};

/**
 * Function to regenerate an access token using a refresh token.
 * @param {Object} accessToken - The refresh token for the user
 * @returns {Object} - A signed JWT access token
 */
// eslint-disable-next-line consistent-return
exports.checkRefreshToken = async function checkRefreshToken(token) {
	const refresh = jwt.verify(token.refresh_token, process.env.JWT_REFRESH_SECRET);
	let user = await model.getById(token.userID, refresh.provider);
	[user] = user; // setting user to first element in user
	if (
		refresh.sub === user.ID
		&& refresh.name === user.username
		&& refresh.iss === '6003CEM Koa Server'
	) {
		const accessToken = await module.exports.genJwtAccessToken(user.ID, user.username);
		return accessToken;
	}
};
