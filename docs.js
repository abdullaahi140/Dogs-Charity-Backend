/**
 * @file Web API Development Blog OpenAPI Docs Server
 * @author Abdullaahi Farah
 * @version v0.1
 * @description This file initialises the docs server and mounts its static paths.
 */

const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
require('dotenv').config();

const app = new Koa();

app.use(mount('/', serve('./docs/jsdocs'))); // serve JSDocs
app.use(mount('/openapi', serve('./docs/openapi'))); // serve OpenAPI docs
app.use(mount('/schema', serve('./schema'))); // serve schemas

const port = process.env.DOCS_SERVER_PORT;

app.listen(port);
// eslint-disable-next-line no-console
console.log(`Docs server running on port ${port}`);
