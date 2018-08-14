const getBook = require('./getBook')
const jwt = require('jsonwebtoken')

exports.getBook = getBook

exports.wxApi = {
    getOpenId: 'https://api.weixin.qq.com/sns/jscode2session'
}

exports.authType = {
    expiresIn: 86400000,
    algorithm: 'HS384'
}

exports.secret = 'dyyao'

exports.sign = (data) => {
    let token = jwt.sign(data, this.secret, this.authType)
    return token
}

exports.decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, this.secret, this.authType, (err, decode) => {
            if(err){
                console.log(err)
                reject(err)
                return
            }
            resolve(decode)
        })
    })
}
