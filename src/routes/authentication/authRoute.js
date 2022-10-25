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

// Create a new user
router.post(
  "/signup",
  [verifyMiddleware.verifyRegister,verifyMiddleware.checkDuplicateUsernameOrEmail,verifyMiddleware.checkRolesExisted  ],
  controller.signup
);
//Login user
router.post("/signin", [verifyMiddleware.VerifyLoginActive,verifyMiddleware.Verifysignin], controller.signin);
//Login user
router.post("/social-login", [verifyMiddleware.VerifyLoginActive,verifyMiddleware.verifySocialLogin], controller.socialSignin);
//verify user account
router.post("/verify", [verifyMiddleware.VerifyOtp], controller.verify);
//re-send-otp
router.post(
  "/re-send-otp",
  [verifyMiddleware.VerifyResendOtp],
  controller.resendEmail
);
//reset-password-link for user account
router.post("/resetPassword", [verifyMiddleware.VerifyEmail],controller.resetPassowrdLink);
//reset-password-link for user account
router.post("/passwordReset", [verifyMiddleware.VerifypasswordReset],controller.resetPassword);

//save user device token
router.post("/save-token", [authJwt.verifyToken,verifyMiddleware.VerifysaveToken],controller.saveToken);

//Logout user
router.post("/logout", [authJwt.logotToken]);
//Get user details via token
router.get("/me", [verifyMiddleware.VerifyActive,authJwt.verifyToken], controller.tokenDetails);

//complete profile
router.post("/completeProfile", [verifyMiddleware.VerifyActive,authJwt.verifyToken,verifyMiddleware.VerifyProfileStatus], controller.comleteProfileDetails);
router.get("/Profile", [verifyMiddleware.VerifyActive,authJwt.verifyToken], controller.getProfileDetails);

module.exports = router;
