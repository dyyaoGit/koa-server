var request = require("request");
var cheerio = require("cheerio");
var article = require("../model/articles")


function getContent(url,id) {
    var content = ''
        request(url,function(err, backData, body) {
            var $ = cheerio.load(body);
            content = $(".content").text().trim();
            article.create({content: content, titleId: id}).then(res => {
                console.log(res)
            })
        })
}



module.exports = getContent

