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
} = require('../controllers/post')
const fileExtLimiter = require('../middlewares/fileExtLimiter')
const fileSizeLimiter = require('../middlewares/fileSizeLimiter')
const filesPayloadExists = require('../middlewares/filesPayloadExists')
const { requireUser } = require('../middlewares/requireUser')
const router = express.Router()

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
router.post('/loadMore', loadMoreHandler)
router.post('/postsCategory', postsCategoryHandler)
router.post('/recommended', recommendedHandler)
router.post('/contentPosts', contentPostsHandler)
router.post('/languagePosts', languagePostsHandler)
router.post('/locationPosts', locationPostsHandler)
router.post('/bookmark', bookmarkHandler)
router.post('/removeBookmark', removeBookmarkHandler)
router.post('/bookmarks', bookmarksHandler)
router.get('/numOfPosts', numOfPostsHandler)
router.get('/postedNews', requireUser, postedNewsHandler)
module.exports = router
