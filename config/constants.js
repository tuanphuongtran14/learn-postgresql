module.exports = {
  HOST: process.env.NODE_ENV === "production" 
    ? process.env.HOST
    : "127.0.0.1",
  PORT: process.env.PORT || 4000,
};
