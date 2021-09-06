const Koa = require('koa');
const cors = require('@koa/cors');
require('dotenv').config();

const app = new Koa();
app.use(cors({
	origin: 'http://localhost:3001',
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const authenticate = require('./routes/authenticate.js');
const users = require('./routes/users.js');
const dogs = require('./routes/dogs.js');
const favDogs = require('./routes/fav_dogs.js');
const chats = require('./routes/chats.js');
const messages = require('./routes/messages.js');
const images = require('./routes/images.js');
const locations = require('./routes/locations.js');

app.use(authenticate.routes());
app.use(users.routes());
app.use(dogs.routes());
app.use(favDogs.routes());
app.use(chats.routes());
app.use(messages.routes());
app.use(images.routes());
app.use(locations.routes());

module.exports = app;
