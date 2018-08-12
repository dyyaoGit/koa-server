const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username: String,
    avatar: String,
    openId: {
        type: String,
        unique: true
    },
    desc: {
        type: String
    },
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
    ]
},{versionKey: false, timestamps: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("user",user)
