const app = require('./app.js');
require('dotenv').config();

const port = process.env.PORT;
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Listening on port ${port}`);
});
