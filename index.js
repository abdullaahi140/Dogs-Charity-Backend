const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());

const port = 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
})