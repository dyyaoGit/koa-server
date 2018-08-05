var request = require("request");
var cheerio = require("cheerio");
var dbConfig = require("../model/config");
var book = require("../model/book");
var titles = require("../model/titles");
const category = require('../model/category')
var getContent = require("./getContent");


function getBook(options) {
    if(!options) {
        throw Error('must be require options')
        return
    }

    let {url, author, img, typeId} = options

    request(url, async (err, data, body) => {
        const $ = cheerio.load(body)
        let name = $("title").text();
        let desc = $("[name=description]").attr("content");

        const type = await category.findById({_id: typeId})

        book.create({title: name, desc,author,img,type: type._id}).then(res => {
            type.update({$push: {books: res._id}})
            $(".catalog a").each(function() {
                var title = $(this).text();
                var num = $(this).attr("href");
                var getUrl = url.split("/");
                getUrl.pop();
                getUrl = getUrl.join("/");
                var trueUrl = getUrl+"/"+num;
                titles.create({title,bookId: res._id}).then(t => {
                    getContent(trueUrl,t._id);
                })
            })
        })

    })
}

module.exports = getBook
