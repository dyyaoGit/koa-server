const mongoose = require('mongoose')

const swiperSchema = mongoose.Schema({
    title: {
        type: String     //轮播图标题
    },
    book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    },
    index: {
        index: -1,
        default: 1,
        type: Number
    },
    img: {              //图片地址
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})


module.exports = mongoose.model('swiper', swiperSchema)
