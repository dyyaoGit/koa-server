const Router = require('koa-router')
const router = new Router()
const categoryModel = require('../model/category')

router.post('/category', async (ctx,next) => {
    console.log(1)
    let {title, icon} = ctx.request.body
    try{
        await categoryModel.create({title, icon})
    }catch(err) {
        throw error(err)
    }
    ctx.body = {
        code: 200,
        msg: '分类插入成功'
    }

})

router.get('/category', async (ctx, next) => {
    const {pn=1,size=10} = ctx.request.query

    const data = await categoryModel
        .find()
        .sort({_id: -1})
        .limit(size)
        .skip((pn-1)*size)

    ctx.body = {
        code: 200,
        data
    }
})

router.get('/category/books', async (ctx, next) => {
    const data = await categoryModel.findBookByType()
    ctx.body = {
        code: 200,
        data
    }
    await next()
})

router.get('/category/:typeId/books', async (ctx, next) => {
    const {typeId} = ctx.params
    const data = await categoryModel
        .findById(typeId)
        .populate({path: 'books'})
    console.log(data)

    ctx.body = {
        code: 200,
        data
    }

})

module.exports = router.routes()
