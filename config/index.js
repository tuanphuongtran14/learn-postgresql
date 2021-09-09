require("dotenv").config();
const constants = require("./constants");
const database = require("./database");

module.exports = {
  ...constants,
  database,
};

