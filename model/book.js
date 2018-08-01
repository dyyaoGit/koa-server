var mongoose = require("mongoose");

var book = new mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    img: {
        type: String
    },
    desc: {
        type: String
    }
},{versionKey: false})

module.exports = mongoose.model("book",book)