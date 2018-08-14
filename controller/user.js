const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const { wxApi, secret,authType } = require('../util/index')
const userModel = require('../model/user')

const jwt = require('jsonwebtoken')



router.post('/login', async (ctx, next) => {
    let userCode = ctx.request.body.code //获取客户端code
    let params = {
        appid: 'wx046d05ad6eaa75a7',
        secret: 'fdf84cdb1e98c0682a6b678e89ffbe30',
        js_code: userCode,
        grant_type: 'authorization_code'
    }//生成请求参数
    const data = await axios.get(wxApi.getOpenId,{params}) //请求腾讯服务器获取open_id和session_key
    let user = await userModel.findOne({
        open_id: data.data.openid
    }) //查找数据库是否有当前用户
    if (!user) {
        user = await userModel.create({ //如果没有就创建一个用户
            open_id: data.data.openid,
            session_key: data.data.session_key
        })
    }

    const tokenData = {
        opend_id: data.data.openid,
        userId: user._id
    }
    const token = jwt.sign(tokenData, secret, authType)
    ctx.set('token', token) //将签名设置到请求头当中
    ctx.body = {
        code: 200,
        msg: '登录成功'
    }
    await next()
})


module.exports = router.routes()
