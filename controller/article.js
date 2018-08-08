const Router = require('koa-router')
const router = new Router()
const articleModel = require('../model/articles')

router.get('/article/:id', async ctx => {
    const {id} = ctx.params
    const data = await articleModel.findOne({titleId: id})
    ctx.body = {
        code: 200,
        data
    }
})




module.exports = router.routes()
