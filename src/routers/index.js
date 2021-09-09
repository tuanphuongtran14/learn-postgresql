const productRouter = require("./product.routes");

module.exports = function(app) {
  app.use("/product", productRouter);
  app.get("/", (req, res) => {
    res.json({
      message: "hello guys",
    });
  });
};
