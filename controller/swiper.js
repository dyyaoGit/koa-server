const Router = require('koa-router')
const router = new Router()
const bookModel = require('../model/book')
const swiperModel = require('../model/swiper')

router.post('/swiper',async (ctx, next) => {
    const {title, img, book, sort=100} = ctx.request.body

    const bookItem = await bookModel.findById(book)
    await swiperModel.create({title, img, book: bookItem._id,sort})
    ctx.body = {
        code: 200,
        msg: '轮播图插入成功'
    }

})

router.get('/swiper', async (ctx, next) => {
    const {pn=1,size=10} = ctx.request.query

    const data = await swiperModel
        .find()
        .sort({_id: -1})
        .skip((pn-1)*size)
        .limit(size)
        .populate({path: 'book'})

    ctx.body = {
        code: 200,
        data
    }
})


module.exports = router.routes()