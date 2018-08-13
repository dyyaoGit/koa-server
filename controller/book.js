const book = require('../model/book')
const titleModel = require('../model/titles')
const category = require('../model/category')
const article = require('../model/articles')
const request = require("request")
const rq = require("request-promise")
const cheerio = require("cheerio")
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

exports.addBook = async ctx => {
    let {url,author,img,typeId} = ctx.request.body
    console.log({ url, author, img})

    const body = await rq(url)  //爬取文章首页
    const $ = cheerio.load(body)
    let name = $("title").text();
    let desc = $("[name=description]").attr("content");
    const type = await category.findById(typeId)  //获取分类

    const bookData = await book.create({title: name, desc,author,img,type: type._id}) //创建一个图书

    await type.update({$push: {books: bookData._id}}) //创建图书后更新分类列表中的图书
    // console.log($(".catalog a"))

    $(".catalog a")     //读取到所有的标题数组
        .each(async function(index) {
            index = parseInt(index)
            var title = $(this).text();
            var num = $(this).attr("href");
            var getUrl = url.split("/");
            getUrl.pop();
            getUrl = getUrl.join("/");
            var trueUrl = getUrl+"/"+num;
            const t = await titleModel.create({title,bookId: bookData._id, index: index})
            const backData = await rq(trueUrl)
            const $Query = cheerio.load(backData);
            const content = $Query(".content").text().trim();
            // console.log(content)
            await article.create({content: content, titleId: t._id, bookId: ObjectId(t.bookId), index: t.index})
        })

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
    console.log(ctx.session)
    const data = await book.findById(ctx.params.id)
    const titles = await titleModel.find({bookId: ctx.params.id})
    ctx.body = {
        code: 200,
        data,
        length: titles.length
    }
}


