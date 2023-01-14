const express = require('express')
const {
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  sitemapHandler,
  languageHandler,
  allHandler,
  locationsHandler,
  contentsHandler,
  handleDeleteContent,
  handleDeleteLanguage,
  handleDeleteLocation,
  handleEditLocation,
  handleEditLanguage,
  handleEditContent,
} = require('../controllers/configuration')
// const { requireUser } = require("../middlewares/requireUser");
const router = express.Router()

router.post('/addLocation', addLocationHandler)
router.post('/addContent', addContentHandler)
router.post('/addLanguage', addLanguageHandler)
router.get('/sitemap', sitemapHandler)
router.get('/languages', languageHandler)
router.get('/contents', contentsHandler)
router.get('/locations', locationsHandler)
router.get('/all', allHandler)
router.delete('/content', handleDeleteContent)
router.delete('/location', handleDeleteLocation)
router.delete('/language', handleDeleteLanguage)
router.patch('/language', handleEditLanguage)
router.patch('/content', handleEditContent)
router.patch('/location', handleEditLocation)

module.exports = router
