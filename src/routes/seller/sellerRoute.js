const router = require("express").Router();
const { verifyMiddleware } = require("../../controllers/middleware");
const { authJwt } = require("../../controllers/middleware");
const controller = require("../../controllers/UserController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "X-Authorization,Authorization, Origin, Content-Type, Accept"
  );
  next();
});

//  default route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Api Engine application.",
  });
});
// router.get("/getAllUsers",  [verifyMiddleware.VerifyActive, authJwt.verifyToken], controller.FetchAllUsers);
// // Get request
// router.get(
//   "/usersRole/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.FetchusersRole
// );
// router.get(
//   "/fetch-appointment",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.FetchAppointment
// );
// router.get(
//   "/all-special-order",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.GetAlluserOrders
// );
// router.get(
//   "/meetDoctor",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.onlineDoctors
// );
// router.get(
//   "/all-special-order/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.GetuserOrders
// );
// router.get(
//   "/specialists",
// [verifyMiddleware.VerifyActive, authJwt.verifyToken],
// controller.GetAllspecialists
// );

// router.get(
//   "/Getspecialists/:id",
// [verifyMiddleware.VerifyActive, authJwt.verifyToken],
// controller.GetspecialistsVisId
// );

// router.get(
//   "/MyPrecription/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getuserMyPrecription
// );
// router.get(
//   "/all-MyPrecription",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.GetuserPrecriptionRequest
// );
// router.get(
//   "/all-precription",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.GetAlluserPrecription
// );
// router.get(
//   "/userProfile",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.userProfile
// );
// router.get(
//   "/wallet",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.userWallet
// );

// router.get(
//   "/fetch-chat-message/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.fetchChatMessage
// );
// router.get(
//   "/getuserTransaction/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getuserTransaction
// );
// router.get(
//   "/list-beneficiary",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getbeneficiary
// );
// router.get(
//   "/notification",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getnotification
// );

// router.get(
//   "/fetchTransactions",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getUserTransactions
// );

// router.get(
//   "/fetchToCart",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.getfetchToCart
// );

// router.delete(
//   "/delete-beneficiary/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.deletebeneficiary
// );

// router.delete(
//   "/deleteToCart/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.deletedeleteToCart
// );

// //POST REQUEST
// router.put(
//   "/userUpdate/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.userUpdate
// );
// router.post(
//   "/fundWallet/:id",
//   [
//     verifyMiddleware.VerifyActive,
//     authJwt.verifyToken,
//     verifyMiddleware.VerifywalletInput,
//   ],
//   controller.funduserWallet
// );



// router.post(
//   "/addToCart",
//   [
//     verifyMiddleware.VerifyActive,
//     authJwt.verifyToken
//   ],
//   controller.createaddToCart
// );

// router.post(
//   "/add-beneficiary",
//   [
//     verifyMiddleware.VerifyActive,
//     authJwt.verifyToken,
//     verifyMiddleware.VerifybeneficiaryInput,
//   ],
//   controller.createbeneficiary
// );
// router.post(
//   "/refill-precription",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.userPrecription
// );
// router.post(
//   "/special-order",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.specialOrder
// );
// router.post(
//   "/saveTransactions",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.addTransactions
// );
// router.post(
//   "/send-chat-message",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.sendChatMessage
// );
// router.post(
//   "/book-appointment",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.bookAppointment
// );
// router.post(
//   "/change_password",
//   [
//     verifyMiddleware.VerifyActive,
//     authJwt.verifyToken,
//     verifyMiddleware.VerifyChangePassword,
//   ],
//   controller.updatePassword
// );

// router.post(
//   "/CreatePrescriptionRequest",
//   [
//     verifyMiddleware.VerifyActive,
//     authJwt.verifyToken,
//   ],
//   controller.CreatePrescription
// );
// router.put(
//   "/precriptionUpdate/:id",
//   [verifyMiddleware.VerifyActive, authJwt.verifyToken],
//   controller.precriptionUpdate
// );

module.exports = router;
