module.exports.initProduct = (db) => {
  return db.model('Product', {
    tableName: 'products',
  }) 
};
