const Koa = require('koa');
const cors = require('@koa/cors');
require('dotenv').config();

const app = new Koa();
app.use(cors());

const authenticate = require('./routes/authenticate.js');
const users = require('./routes/users.js');

app.use(authenticate.routes());
app.use(users.routes());

module.exports = app;
