const router = require('express').Router();
const { authJwt } = require("../controllers/middleware");
const { verifyMiddleware } = require("../controllers/middleware");
const controller = require("../controllers/WelcomeController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

router.get("/", controller.allAccess);
 //encrypt user data
 router.post("/encrypt", controller.encrypt);
 router.post("/AddReport", [verifyMiddleware.VerifyActive,verifyMiddleware.verifyInput], controller.saveReport);
  router.post("/dencrypt", controller.dencrypt);
  router.get("/getCountry", controller.getCountry);
  router.get("/getCountryState/:id", controller.getCountryState);
router.get("/getStateCity/:id/:state", controller.getStateCity);
router.get("/getReport",[verifyMiddleware.VerifyActive,authJwt.verifyToken], controller.getReport);


module.exports=router;



