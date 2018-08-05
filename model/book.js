var mongoose = require("mongoose")


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
    },
    type: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'category',
        require: true
    }
},{versionKey: false})


module.exports = mongoose.model("book",book)
