const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const {
  fetchCompanyHandler,
  updateEditorHandler,
  fetchOneCompanyHandler,
  suspendHandler,
  numOfAuthorHandler,
} = require("../controllers/companies");
const fileExist = require("../middlewares/fileExist");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");
const filesPayloadExists = require("../middlewares/filesPayloadExists");

router.get("/fetch", fetchCompanyHandler);

router.post("/fetchOne", fetchOneCompanyHandler);

router.patch(
  "/update",
  fileUpload({ createParentPath: true }),
  fileExist,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  updateEditorHandler
);

router.post("/suspend", suspendHandler);

router.get("/numOfAuthors", numOfAuthorHandler);

module.exports = router;
