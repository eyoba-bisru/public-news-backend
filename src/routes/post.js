const express = require("express");
const {
  postsHomeHandler,
  addPostHandler,
  loadMoreHandler,
  postsCategoryHandler,
  postHandler,
  recommendedHandler,
  contentPostsHandler,
  languagePostsHandler,
  locationPostsHandler,
  numOfPostsHandler,
} = require("../controllers/post");
const { requireUser } = require("../middlewares/requireUser");
const router = express.Router();

router.post("/", postHandler);
router.get("/postsHome", postsHomeHandler);
router.post("/addPost", requireUser, addPostHandler);
router.post("/loadMore", loadMoreHandler);
router.post("/postsCategory", postsCategoryHandler);
router.post("/recommended", recommendedHandler);
router.post("/contentPosts", contentPostsHandler);
router.post("/languagePosts", languagePostsHandler);
router.post("/locationPosts", locationPostsHandler);

router.get("/numOfPosts", numOfPostsHandler);

module.exports = router;
