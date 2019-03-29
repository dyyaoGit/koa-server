const mongoose = require("mongoose")

const sms = new mongoose.Schema({
    phone: String,
    sixCode: String
},{versionKey: false, timestamps: {createdAt: 'createdTime', updatedAt: 'updatedTime'}})

module.exports = mongoose.model("sms",sms)
