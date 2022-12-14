const express = require('express')
const {
  postsHomeHandler,
  addPostHandler,
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  loadMoreHandler,
  postsCategoryHandler,
  postHandler,
  recommendationHandler,
} = require('../controllers/post')
const { requireUser } = require('../middlewares/requireUser')
const router = express.Router()

router.post('/', postHandler)
router.get('/postsHome', postsHomeHandler)
router.post('/addPost', requireUser, addPostHandler)
router.post('/loadMore', loadMoreHandler)
router.post('/postsCategory', postsCategoryHandler)
router.post('/recommended', recommendationHandler)
module.exports = router
