const express = require("express");
const router = express.Router();

const {
  createSessionHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
  verificationHandler,
  resendMail,
} = require("../controllers/auth");
const { requireUser } = require("../middlewares/requireUser");
const { verifyUser } = require("../middlewares/verifyUser");

router.post("/signup", createUserHandler);

// login
router.post("/login", createSessionHandler);

// verify
router.get("/verify/:email/:token", verificationHandler);

router.use(requireUser);

router.post("/mail", resendMail);

router.use(verifyUser);

// get the current session
router.get("/session", getSessionHandler);

// logout
router.delete("/logout", deleteSessionHandler);

module.exports = router;
