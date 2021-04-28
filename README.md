# 6003CEM-backend

This is the backend for the dogs charity shelter. To get started make sure you create 2 databases with MySQL as root user. The first is to be named **6003CEM** and the second **TEST_6003CEM**. This project relies on this being set up beforehand. You'll then need to open the `.env` file located in the root of the project. Make sure to set-up the secrets for JWTs and provide credentials for Google OAuth and Twitter.

You'll then want to migrate and seed the database using the `npm run refresh_db`. This will create all the tables for the database and add some data to create users, dogs etc.

Finally to start the server you can run either `node index.js` or `nodemon` depending on if you have nodemon installed globally.

To generate JSDocs for the project, run `npm run docs`. To view documentation and OpenAPI specification, you can use the docs server by running either `node docs.js` or `nodemon docs.js`. The following links lead to these destinations:
* `/`: The JSDocs documentation 
* `/openapi`: The OpenAPI 3.0 specification for the project
* `/schema/{SCHEMA_FILENAME_HERE}`: The schemas used in the project