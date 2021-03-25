const bcrypt = require('bcrypt');

async function hashPassword(body) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const password = await bcrypt.hash(body.password, salt);
	body.passwordSalt = salt;
	body.password = password;
	return body;
};

module.exports = hashPassword;