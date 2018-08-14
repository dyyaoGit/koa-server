const getBook = require('./getBook')

exports.getBook = getBook

exports.wxApi = {
    getOpenId: 'https://api.weixin.qq.com/sns/jscode2session'
}
