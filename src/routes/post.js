const express = require("express");
const {
  postsHomeHandler,
  addPostHandler,
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  loadMoreHandler,
  postsCategoryHandler,
  postHandler,
} = require("../controllers/post");
const { requireUser } = require("../middlewares/requireUser");
const router = express.Router();

router.get("/postsHome", postsHomeHandler);
router.post("/addPost", requireUser, addPostHandler);
router.post("/addLocation", addLocationHandler);
router.post("/addContent", addContentHandler);
router.post("/addLanguage", addLanguageHandler);
router.post("/loadMore", loadMoreHandler);
router.post("/postsCategory", postsCategoryHandler);
router.post("/post", postHandler);

module.exports = router;
