const likeModel = require('../model/like')
const Router = require('koa-router')
const router = new Router()
const {decodeToken} = require('../util/index')
const ObjectId = require('mongoose').Types.ObjectId

router.get('/', async ctx => {
    const {pn=1, size=10} = ctx.request.query
    const token = ctx.request.headers.token || ''
    let userData
    try {
        userData = await decodeToken(token)
    } catch (err) {
        console.log(err)
        ctx.body = {
            code: 401,
            msg: '登陆状态失效,请重新登陆'
        }
        return
    }

    let like = await likeModel
        .find({user: ObjectId(userData.userId)})
        .populate({path: 'book'})
        .populate({path: 'title'})
        .sort({_id:-1})
        .skip((pn-1)*(size-0))
        .limit((size-0))

    ctx.body = {
        code: 200,
        data: like
    }
})

router.post('/', async (ctx) => {  // 添加喜欢
    const token = ctx.request.headers.token || ''
    let {bookId, titleId} = ctx.request.body
    let userData
    try {
        userData = await decodeToken(token)
    } catch (err) {
        console.log(err)
        ctx.body = {
            code: 401,
            msg: '登陆状态失效,请重新登陆'
        }
        return
    }

    const likeData = await likeModel.findOne({
        title: titleId
    })
    if(likeData){
        ctx.body = {
            code: 400,
            msg:'已经标记为喜欢的文章了'
        }
    } else {
        await likeModel.create({
            title: ObjectId(titleId),
            book: ObjectId(bookId),
            user: ObjectId(userData.userId)
        })
        ctx.body = {
            code: 200,
            msg: '文章已添加到喜欢中'
        }
    }

})

module.exports = router.routes()
