const mongoose = require('mongoose')

const session = mongoose.Schema({
    key: {
        type: String,
        index: true
    },
    session: {
        type: mongoose.SchemaTypes.Mixed
    },
    createTime: {
        type: Date,
        index: 1,
        expires: 86400000*7
    }
},{versionKey: false, timestamp: {createdAt: "createTime", updatedAt: 'updateTime'}})


module.exports = mongoose.model('session', session, 'session')
