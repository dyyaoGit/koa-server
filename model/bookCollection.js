const mongoose = require("mongoose")

const bookCollection = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    }
},{versionKey: false, timestamp: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("bookCollection", bookCollection)
