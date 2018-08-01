const Router = require('koa-router')
const router = new Router()
const {addBook,getBook} = require('./book')

router.use((ctx,next) => {
    next()
    console.log(ctx.url + ' ' + ctx.method + ' ' + ctx.response.status)
})

router.post('/book', addBook)
router.get('/book', getBook)

module.exports = router;