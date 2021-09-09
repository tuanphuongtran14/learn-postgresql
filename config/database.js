module.exports = {
  url: `postgresql://${process.env.APP_DB_USERNAME}:${process.env.APP_DB_PASSWORD}@localhost:5432/${process.env.APP_DB_NAME}`,
};
