var request = require("request");
var cheerio = require("cheerio");
var dbConfig = require("../model/config");
var book = require("../model/book");
var titles = require("../model/titles");
var getContent = require("./getContent");


function getBook(options) {
    if(!options) {
        throw Error('must be require options')
        return 
    }

    let {url, author, img} = options

    request(url, (err, data, body) => {
        const $ = cheerio.load(body)
        let name = $("title").text();
        let desc = $("[name=description]").attr("content");

        book.create({title: name, desc,author,img}).then(res => {
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
