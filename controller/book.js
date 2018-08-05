const Router = require('koa-router')
const router = new Router()
const {getBook} = require('../util/index')
const book = require('../model/book')

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
    const data = await book.find()
    console.log(data)
    ctx.body = {
        code: 200,
        data
    }

}

exports.getBookById = async (ctx, next) => {
    const data = await book.find({_id: ctx.params.id})
    ctx.body = {
        code: 200,
        data
    }
}

exports.getBookByType = async (ctx, next) => {
    const {typeId} = ctx.request.params
    const data = await book.findByType(typeId)
    console.log(data)
    await next()
}

