require("dotenv").config();

const config = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    // Use a different storage. Default: none
    "seederStorage": "sequelize",
    "logging": msg => console.log(msg, "(Date: " + new Date().toUTCString() + ")")
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "seederStorage": "sequelize",
    "logging": msg => console.log(msg, "(Date: " + new Date().toUTCString() + ")")
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "seederStorage": "sequelize",
    "logging": msg => console.log(msg, "(Date: " + new Date().toUTCString() + ")")
  }
}

if(process.env.DB_DIALECT === "postgres") {
  if(!config.development.dialectOptions) config.development.dialectOptions = {};
  if(!config.development.dialectOptions.ssl) config.development.dialectOptions.ssl = {};
  config.development.dialectOptions.ssl.require = process.env.DB_SSL_REQUIRE === "true";
  config.development.dialectOptions.ssl.rejectUnauthorized = false;

  if(!config.test.dialectOptions) config.test.dialectOptions = {};
  if(!config.test.dialectOptions.ssl) config.test.dialectOptions.ssl = {};
  config.test.dialectOptions.ssl.require = process.env.DB_SSL_REQUIRE === "true";
  config.test.dialectOptions.ssl.rejectUnauthorized = false;

  if(!config.production.dialectOptions) config.production.dialectOptions = {};
  if(!config.production.dialectOptions.ssl) config.production.dialectOptions.ssl = {};
  config.production.dialectOptions.ssl.require = process.env.DB_SSL_REQUIRE === "true";
  config.production.dialectOptions.ssl.rejectUnauthorized = false;
}

if(process.env.DB_TIMESTAMPS === 'false') {
  if(!config.development.define) config.development.define = {};
  config.development.define.timestamps = false;
  config.development.define.underscored = true;

  if(!config.test.define) config.test.define = {};
  config.test.define.timestamps = false;
  config.test.define.underscored = true;

  if(!config.production.define) config.production.define = {};
  config.production.define.timestamps = false;
  config.production.define.underscored = true;
}


if(process.env.DB_UNDERSCORED === "true") {
  if(!config.development.define) config.development.define = {};
  config.development.define.underscored = true;

  if(!config.test.define) config.test.define = {};
  config.test.define.underscored = true;

  if(!config.production.define) config.production.define = {};
  config.production.define.underscored = true;
}


module.exports = config;
