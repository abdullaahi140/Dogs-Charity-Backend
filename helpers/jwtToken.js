const jwt = require('jsonwebtoken');
const model = require('../models/users.js');
require('dotenv').config()

require('dotenv').config();
const payload = {
	iss: '6003CEM Koa Server',
	aud: '600CEM SPA',
};

exports.genJwtAccessToken = async function genJwtAccessToken(ID, username) {
	payload.sub = ID;
	payload.name = username;
	const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
	return access_token;
}

exports.genJwtRefreshToken = async function genJwtRefreshToken(ID, username) {
	payload.sub = ID;
	payload.name = username;
	const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '4w' });
	const user_refresh = { userID: ID, refresh_token: refresh_token };
	return user_refresh;
}

exports.checkRefreshToken = async function checkRefreshToken(token) {
	try {
		const refresh = jwt.verify(token.refresh_token, process.env.JWT_REFRESH_SECRET);
		let user = await model.getById(token.userID);
		user = user[0];
		if (
			refresh.sub === user.ID &&
			refresh.name === user.username &&
			refresh.iss === '6003CEM Koa Server'
		) {
			const access_token = await module.exports.genJwtAccessToken(user.ID, user.username)
			return access_token;
		}
	} catch (err) {
		console.error(err);
		return false;
	}
}
