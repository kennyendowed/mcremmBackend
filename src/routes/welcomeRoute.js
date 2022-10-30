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
router.get("/GetallCompany",[authJwt.verifyToken],controller.GetallCompany);
   router.get("/getCountry", controller.getCountry);
  router.get("/getCountryState/:id", controller.getCountryState);
router.get("/getStateCity/:id/:state", controller.getStateCity);

router.post("/encrypt", controller.encrypt);
 router.post("/getReport",[verifyMiddleware.VerifyActive,authJwt.verifyToken], controller.getReport);
 router.post("/AddReport", [verifyMiddleware.VerifyActive,authJwt.verifyToken,verifyMiddleware.verifyInput], controller.saveReport);
  router.post("/dencrypt", controller.dencrypt);
  router.post("/Download",[verifyMiddleware.VerifyActive,authJwt.verifyToken], controller.DownloadReport);

module.exports=router;



