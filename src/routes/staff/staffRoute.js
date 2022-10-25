const router = require("express").Router();
const { authJwt } = require("../../controllers/middleware");
const users = require("../../controllers/UserController.js");
const { verifyMiddleware } = require("../../controllers/middleware");
const controller = require("../../controllers/AuthController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "X-Authorization,Authorization, Origin, Content-Type, Accept"
  );
  next();
});


module.exports = router;
