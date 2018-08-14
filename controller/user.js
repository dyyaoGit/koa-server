const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const {wxApi} = require('../util/index')
// const jwt = require('jsonwebtoken')



router.post('/login', async (ctx, next) => {
    let userCode = ctx.request.body.code
        // ?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    let params = {
        appid: 'wx046d05ad6eaa75a7',
        secret: 'fdf84cdb1e98c0682a6b678e89ffbe30',
        js_code: userCode,
        grant_type: 'authorization_code'
    }
    const data = await axios.get(wxApi.getOpenId,{params})
    console.log(data.data)
    ctx.session.user = data.data
    ctx.body = {
        code: 200,
        msg: '登录成功'
    }
    await next()

})


module.exports = router.routes()
