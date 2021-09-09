const { Product } = require("../models");

module.exports.create = async (req, res) => {
  const { name, price } = req.body;
  const newProduct = Product.forge({
    name: name,
    price: price,
  });

  try {
    const result = await newProduct.save();
    console.log(result);
    return res.status(201).json({
      data: result,
      error: null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: error
    });
  };
};

module.exports.deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Product.query().where("id", id).del();
    console.log(result);
    return res.status(204).json({
      data: result,
      error: null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: error
    });
  };
};

module.exports.getAll = async (req, res) => {
  try {
    const result = await Product.collection().fetch();
    console.log(result);
    return res.status(201).json({
      data: result,
      error: null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: error
    });
  };
};

module.exports.updateById = async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const result = await Product.query().where("id", id).update({
      ...update
    });
    console.log(result);
    return res.status(200).json({
      data: result,
      error: null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: error
    });
  };
};
