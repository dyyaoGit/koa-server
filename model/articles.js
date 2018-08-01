var mongoose = require("mongoose");

var article = mongoose.Schema({
    content: {
        type: String
    },
    titleId: {
        type: String
    }
}, {versionKey: false})

module.exports = mongoose.model("article",article);