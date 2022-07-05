var express = require("express");
const {
  register_post,
  login_post,
  login_get,
  register_get,
} = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/login", login_get).post("/login", login_post);
router
  .get("/register", register_get)
  .post("/register", register_post.validation, register_post.handler);

module.exports = router;
