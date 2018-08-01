const Router = require('koa-router')
const router = new Router()
const {getBook} = require('../util')
const book = require('../model/book')
const Bluebird = require('bluebird')

exports.addBook = ctx => {
    let {url,author,img} = ctx.request.body
    console.log({ url, author, img})
    getBook({ url, author, img})
    ctx.body = {
        code: 200,
        msg: '收到'
    }
    // getBook({ url, author, img})
}

exports.getBook = async function(ctx,next) {
    let query = book.find()
    let arr = []
    await query.exec(function(err, data) {
        arr = data;
        console.log(data)
    })
    return arr
    console.log(arr)
    ctx.body = {
        msg: "2341",
        data: arr
    }
    await next();
}