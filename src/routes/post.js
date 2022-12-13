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

router.post("/", postHandler);
router.get("/postsHome", postsHomeHandler);
router.post("/addPost", requireUser, addPostHandler);
router.post("/loadMore", loadMoreHandler);
router.post("/postsCategory", postsCategoryHandler);

module.exports = router;
