const express = require('express')
const fileUpload = require('express-fileupload')
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
  bookmarkHandler,
  removeBookmarkHandler,
  bookmarksHandler,
  postedNewsHandler,
  likeHandler,
  isLikedHandler,
  numOfLikedHandler,
  unlikeHandler,
  isUnlikedHandler,
  commentsHandler,
  getAllCommentsHandler,
  reportsHandler,
  reportFetchHandler,
  reportDeleteHandler,
  customizeHandler,
  searchHandler,
  analyticsHandler,
  addVistorHandler,
  visitorsHandler,
} = require("../controllers/post");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");
const filesPayloadExists = require("../middlewares/filesPayloadExists");
const { requireUser } = require("../middlewares/requireUser");
const router = express.Router();

router.post('/', postHandler)
router.get('/postsHome', postsHomeHandler)
router.post(
  '/addPost',
  requireUser,
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.png', '.jpg', '.jpeg']),
  fileSizeLimiter,
  addPostHandler
)

router.get('/reportFetch', reportFetchHandler)
router.delete('/reportDelete', reportDeleteHandler)
router.post('/reports', reportsHandler)
router.post("/loadMore", loadMoreHandler);
router.post("/postsCategory", postsCategoryHandler);
router.post("/recommended", recommendedHandler);
router.post("/contentPosts", contentPostsHandler);
router.post("/languagePosts", languagePostsHandler);
router.post("/locationPosts", locationPostsHandler);
router.post("/bookmark", bookmarkHandler);
router.post("/removeBookmark", removeBookmarkHandler);
router.post("/bookmarks", bookmarksHandler);
router.get("/numOfPosts", numOfPostsHandler);
router.get("/postedNews", requireUser, postedNewsHandler);
router.post("/like", likeHandler);
router.post("/unlike", unlikeHandler);
router.post("/isLiked", isLikedHandler);
router.post("/isUnliked", isUnlikedHandler);
router.post("/numOfLiked", numOfLikedHandler);
router.post("/comments", commentsHandler);
router.post("/getAllComments", getAllCommentsHandler);
router.post("/customize", customizeHandler);
router.post("/search", searchHandler);
router.get("/analytics", analyticsHandler);
router.post("/addVistor", addVistorHandler);
router.get("/visitors", visitorsHandler);

module.exports = router;
