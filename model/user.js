const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username: String,
    password: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        default: 'http://image.yaojunrong.com/zhenxiang.jpg'
    },
    open_id: {
        type: String
    },
    desc: {
        type: String
    },
    session_key: String,
    fans: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        }
    ],
    attentions: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        }
    ],
    collected: {
        type: Number,
        default: 0
    }
},{versionKey: false, timestamps: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("user",user)
