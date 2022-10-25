const router = require('express').Router();
const { verifyMiddleware } = require("../../controllers/middleware");
const { authJwt } = require("../../controllers/middleware");
const controller = require("../../controllers/AdminController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization,Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  //  default route
router.get("/",(req,res)=>{
    res.json({
        message:"Welcome to Api Engine application.",
    });
});

// Create a new provider
router.post("/addSkills",[authJwt.verifyToken,authJwt.isAdmin,verifyMiddleware.verifyskillsInput],
  controller.CreateSkills
);
router.delete("/getSkills/:id",[authJwt.verifyToken,authJwt.isAdmin], controller.SkillDelete);

// router.get(
//   "admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );

// router.get(
//   "admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );



module.exports=router;