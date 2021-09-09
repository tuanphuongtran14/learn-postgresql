const knex = require('knex');
const bookshelf = require('bookshelf');

const { database: {
  url
}} = require("../../config");
const { initProduct } = require("./product.model");

const pgsql = knex({
  client: 'pg',
  connection: url,
});

const db = bookshelf(pgsql);
db.checkConnection = async function() {
  try {
    await pgsql.raw("SELECT 1");
    return {
      isConnected: true,
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error,
    }
  }
};
db.Product = initProduct(db);

module.exports = db;