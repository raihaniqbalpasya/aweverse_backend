const express = require("express");
const app = express();
const port = 3001;
const userController = require("./app/controllers/userControllers");
const userMiddleware = require("./middlewares/userMiddleware");

// database connection
require("dotenv").config();

// json parser
app.use(express.json());

// main route
app.get("/", (req, res) => {
  res.send("Account Modification");
});

// user routes
app.get("/api/v1/user", userController.getAll);
app.get("/api/v1/user/:id", userController.getMyProfile);
app.post("/api/v1/user/register", userController.register);
app.post("/api/v1/user/login", userController.login);
app.put(
  "/api/v1/user/change-password",
  userMiddleware.authorize,
  userController.changePassword
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
