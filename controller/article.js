const Router = require('koa-router')
const router = new Router()
const articleModel = require('../model/articles')
const titleModel = require('../model/titles')
const Towxml = require('../util/towxml/main')
const towxml = new Towxml()

router.get('/article/:id', async ctx => {
    const {id} = ctx.params
    let data = await articleModel.findOne({titleId: id})
    const title = await titleModel.findById(data.titleId)
    // let nodeArr = towxml.toJson(data.content, 'markdown')
    // let nodeArr = towxml.md2wxml(data.content)

    console.log(title)
    ctx.body = {
        code: 200,
        data: {
            article: data,
            title: title.title
            // nodeArr
        }
    }
})



module.exports = router.routes()
