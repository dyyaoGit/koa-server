const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const articleModel = require('../model/articles')
const titleModel = require('../model/titles')
const Towxml = require('../util/towxml/main')
const towxml = new Towxml()

router.get('/article/:id', async ctx => {
    const {id} = ctx.params
    let data = await articleModel.findOne({titleId: id})
    const title = await titleModel.findById(data.titleId)
    const token = ctx.header.token
    let user
    if(token){
        jwt.verify(token, 'yaoyaoyao', function (err, decode) {
            console.log(err)
            console.log(decode)
        })

    }
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
