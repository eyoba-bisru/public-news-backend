const express = require("express");
const router = express.Router();

const {
  loginHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
  verificationHandler,
  resendMail,
  createEditorHandler,
} = require("../controllers/auth");
const { requireUser } = require("../middlewares/requireUser");
const { verifyUser } = require("../middlewares/verifyUser");

router.post("/signup", createUserHandler);

router.post("/login", loginHandler);

router.get("/verify/:email/:token", verificationHandler);

router.use(requireUser);

router.post("/mail", resendMail);

router.get("/session", getSessionHandler);
router.delete("/logout", deleteSessionHandler);
router.use(verifyUser);

router.post("/registerEditor", createEditorHandler);

module.exports = router;
