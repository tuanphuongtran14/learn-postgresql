const express = require("express");
const morgan = require("morgan");

const app = express();
const router = require("./src/routers");
const db = require("./src/models");

// log the coming request
app.use(morgan("dev"));

// parse JSON
app.use(express.json());

db.checkConnection().then(({ isConnected, error }) => {
  if(isConnected) {
    console.log("Connect to database successfully");
  } else {
    console.log("Connect to database failed", error);
    process.exit();
  }
});

// routing
router(app);

app.listen(3000, () => {
  console.log(`Server start listening at http://localhost:3000`);
});
