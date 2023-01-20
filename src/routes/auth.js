const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const path = require("path");

const filesPayloadExists = require("../middlewares/filesPayloadExists");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");

const {
  loginHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
  verificationHandler,
  resendMail,
  createEditorHandler,
  numOfSubsHandler,
  changePasswordHandler
} = require("../controllers/auth");
const { requireUser } = require("../middlewares/requireUser");
const { verifyUser } = require("../middlewares/verifyUser");

router.post("/signup", createUserHandler);

router.post("/login", loginHandler);

router.get("/verify/:email/:token", verificationHandler);

// router.post(
//   "/upload",
//   fileUpload({ createParentPath: true }),
//   filesPayloadExists,
//   fileExtLimiter([".png", ".jpg", ".jpeg"]),
//   fileSizeLimiter,
//   (req, res) => {
//     try {
//       const files = req.files;
//       console.log(files["eyo b.png"]);

//       Object.keys(files).forEach((key) => {
//         const filepath = path.join(__dirname, "files", files[key].name);
//         files[key].mv(filepath, (err) => {
//           if (err)
//             return res.status(500).json({ status: "error", message: err });
//         });
//       });

//       return res.json({
//         status: "success",
//         message: Object.keys(files).toString(),
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

router.use(requireUser);

router.post("/mail", resendMail);

router.get("/session", getSessionHandler);
router.delete("/logout", deleteSessionHandler);
// router.use(verifyUser);
router.get("/numOfSubs", numOfSubsHandler);

router.post('/changepassword', changePasswordHandler)

router.post(
  "/registerEditor",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  createEditorHandler
);

module.exports = router;
