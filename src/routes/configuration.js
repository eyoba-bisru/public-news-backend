const express = require("express");
const {
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  sitemapHandler,
  languageHandler,
  allHandler,
} = require("../controllers/configuration");
// const { requireUser } = require("../middlewares/requireUser");
const router = express.Router();

router.post("/addLocation", addLocationHandler);
router.post("/addContent", addContentHandler);
router.post("/addLanguage", addLanguageHandler);
router.get("/sitemap", sitemapHandler);
router.get("/languages", languageHandler);
router.get("/all", allHandler);

module.exports = router;
