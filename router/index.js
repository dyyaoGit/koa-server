const Router = require('koa-router')
const router = new Router()
const {addBook, getBook, getBookById, getBookByType} = require('../controller/book')
const {logger} = require('./koa-logger')
const category = require('../controller/category')
const swiper = require('../controller/swiper')

router.use(logger)

router.post('/book', addBook)
router.get('/book', getBook)
router.get('/book/:id', getBookById)
router.get('/book/type/:typeId', getBookByType)
router.use(category)
router.use(swiper)

module.exports = router;
