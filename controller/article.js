const Router = require('koa-router')
const router = new Router()
const articleModel = require('../model/articles')
const titleModel = require('../model/titles')

router.get('/article/:id', async ctx => {
    const {id} = ctx.params
    const data = await articleModel.findOne({titleId: id})
    const title = await titleModel.findById(data.titleId)
    console.log(title)
    ctx.body = {
        code: 200,
        data: {
            article: data,
            title: title.title
        }
    }
})



module.exports = router.routes()
