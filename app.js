const Koa = require('koa');
const cors = require('@koa/cors');
require('dotenv').config();

const app = new Koa();
app.use(cors());

const authenticate = require('./routes/authenticate.js');
const users = require('./routes/users.js');
const dogs = require('./routes/dogs.js');
const favDogs = require('./routes/fav_dogs.js');
const chats = require('./routes/chats.js');
const messages = require('./routes/messages.js');

app.use(authenticate.routes());
app.use(users.routes());
app.use(dogs.routes());
app.use(favDogs.routes());
app.use(chats.routes());
app.use(messages.routes());

module.exports = app;
