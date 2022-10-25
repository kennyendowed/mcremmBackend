const router = require('express').Router();
const { authJwt } = require("../controllers/middleware");
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

 router.get("/getSkills", controller.getSkills);
  router.post("/dencrypt", controller.dencrypt);
  router.get("/getCountry", controller.getCountry);
  router.get("/getCountryState/:id", controller.getCountryState);
router.get("/getStateCity/:id/:state", controller.getStateCity);
router.get("/getServices", controller.getServices);
router.get("/searchSubServices/:subService", controller.filterSubServices);
router.get("/getActiveServices", controller.getActiveServices);
router.get("/getActiveSubServicesSeller/:service/:subService", controller.getActiveSubServicesSeller);


module.exports=router;



