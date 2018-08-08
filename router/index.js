const Router = require('koa-router')
const router = new Router()
const {addBook, getBook, getBookById, getBookByType} = require('../controller/book')
const {logger} = require('./koa-logger')
const category = require('../controller/category')
const swiper = require('../controller/swiper')
const titles = require('../controller/title')
const article = require('../controller/article')

router.use(logger)

router.post('/book', addBook)
router.get('/book', getBook)
router.get('/book/:id', getBookById)
router.use(category)
router.use(swiper)
router.use(titles)
router.use(article)

module.exports = router;
