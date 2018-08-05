const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    icon: {
        type: String
    },
    books: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'book'
        }
    ]
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})

categorySchema.statics.findBookByType = function (options,cb) {
    return this.find()
        .populate({path: 'books', options: {limit: 4}})
        .exec(cb)
}

module.exports = mongoose.model("category",categorySchema)
