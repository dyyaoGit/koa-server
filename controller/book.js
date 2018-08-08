const Router = require('koa-router')
const router = new Router()
const {getBook} = require('../util/index')
const book = require('../model/book')
const titleModel = require('../model/titles')

exports.addBook = ctx => {
    let {url,author,img,typeId} = ctx.request.body
    console.log({ url, author, img})
    getBook({ url, author, img,typeId})
    ctx.body = {
        code: 200,
        msg: '收到'
    }
}

exports.getBook = async (ctx,next) => {
    const {pn, size} = ctx.request.query

    const data = await book.find()
        .populate({path: 'type'})
        .sort({_id:-1})
        .limit(size)
        .skip((pn-1)*size)

    ctx.body = {
        code: 200,
        data
    }

}

exports.getBookById = async (ctx, next) => {
    const data = await book.findById(ctx.params.id)
    const titles = await titleModel.find({bookId: ctx.params.id})
    ctx.body = {
        code: 200,
        data,
        length: titles.length
    }
}


