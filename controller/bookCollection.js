const Router = require('koa-router')
const router = new Router()
const collectionModel = require('../model/bookCollection')
const {decodeToken} = require('../util/index')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post('/collection', async (ctx, next) => {
    let token = ctx.request.headers.token
    let {bookId} = ctx.request.body
    let data
    try {
        data = await decodeToken(token)
        console.log(data.userId)
        const book = await collectionModel.findOne(
                {
                    user: ObjectId(data.userId),
                    book: ObjectId(bookId)
                })
        if(book){
            ctx.body = {
                code: 400,
                msg: '图书不能重复添加'
            }
        } else {
            await collectionModel.create({user: ObjectId(data.userId), book: ObjectId(bookId)})
            ctx.body = {
                code: 200,
                msg: '图片增加成功'
            }
        }
        await next()
    } catch(err) {
        ctx.body = {
            code: 401,
            msg: '登陆状态过期，请重新登陆'
        }
    }
})

router.get('/collection', async (ctx, next) => {
    const token = ctx.request.headers.token
    const {pn=1, size=10} = ctx.request.query
    try{
        const tokenData = await decodeToken(token)
        const data = await collectionModel
            .find({user: ObjectId(tokenData.userId)})
            .populate({path: 'book'})
            .skip((pn-1)*size)
            .limit(size)
            .sort({_id: -1})
        ctx.body = {
            code: 200,
            data
        }
    } catch (err) {
        ctx.body = {
            code: 401,
            msg: '登陆状态失效，请重新登陆'
        }
    }
})

module.exports = router.routes()
