const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const { wxApi, secret,authType, decodeToken } = require('../util/index')
const userModel = require('../model/user')
const smsClient = require('../sms/main')
const validator = require('validator')
const smsModel = require('../model/sms')
const cors = require('koa-cors')

router.use(cors({

}))

const jwt = require('jsonwebtoken')



router.post('/login', async (ctx, next) => { // 小程序登录用
    let userCode = ctx.request.body.code //获取客户端code
    let {
        appid='wx046d05ad6eaa75a7',
        secret='fdf84cdb1e98c0682a6b678e89ffbe30'
    } = ctx.request.body // 获取应用的appid和secret


    // let params = {
    //     appid: 'wx046d05ad6eaa75a7',
    //     secret: 'fdf84cdb1e98c0682a6b678e89ffbe30',
    //     js_code: userCode,
    //     grant_type: 'authorization_code'
    // }//生成请求参数
    let params = {
        appid,
        secret,
        js_code: userCode,
        grant_type: 'authorization_code'
    }//生成请求参数

    console.log('appid信息', params)
    const data = await axios.get(wxApi.getOpenId,{params}) //请求腾讯服务器获取open_id和session_key
    console.log('code信息',data.data)
    if (data.data.errcode) {
        console.log(data.data)
        ctx.body = {
            code: 401,
            msg: '登录失败,无效的code'
        }
        return
    }

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
    const token = jwt.sign(tokenData, 'dyyao', authType)
    ctx.set('token', token) //将签名设置到请求头当中
    ctx.body = {
        code: 200,
        msg: '登录成功'
    }
    await next()
})

router.get('/user', async (ctx, next) => {
    let {token} = ctx.request.header || ''
    let userData

    try {  // 解密token
        userData = decodeToken(token)
    } catch (err) {
        ctx.body = {
            code: 401,
            msg: err
        }
        throw Error(err)
    }
    let user = await userModel.findById(userData.userId, {open_id: 0})
    console.log(userData)
    if (!user) {
        ctx.body = {
            code: 403,
            msg: '用户不存在'
        }
        return
    }

    ctx.body = {
        code: 200,
        // msg:
        data: user
    }
})

router.post('/login_html', async ctx => {
    const {phone, password} = ctx.request.body

     const user = await userModel.findOne({
        phone: String(phone)
    }).sort({_id: -1})

    if(user){
        if(user.password === password){
            const tokenData = {
                userId: user._id
            }
            const token = jwt.sign(tokenData, 'dyyao', authType)
            ctx.set('token', token) //将签名设置到请求头当中
            ctx.body = {
                code: 200,
                token
            }
        } else {
            ctx.body = {
                code: 400,
                msg: '密码不正确'
            }
        }
    } else {
        ctx.body = {
            code: 400,
            msg: '用户名不存在'
        }
    }
})

router.post('/register', async ctx => {
    const {username, password, phone, code} = ctx.request.body

    console.log(ctx.request.body);

    if(!phone||!username||!password||!code){
        ctx.body = {
            code: 400,
            msg: '缺少必要参数'
        }
        return
    }

    const user = await userModel.findOne({
        phone
    })

    if(!user){ // 用户未注册
        const smsMsg = await smsModel.findOne({
            phone
        }).sort({_id: -1})

        console.log(smsMsg);

        if(smsMsg){ // 存在已发送短信列表
            if(Date.now() - new Date(smsMsg.updatedTime).getTime() < 1000 * 60 * 5) { // 小于5分钟内
                if(smsMsg.sixCode === code){
                    await userModel.create({
                        username,
                        password,
                        phone
                    })
                    ctx.body = {
                        code: 200,
                        msg: '注册成功'
                    }
                } else { // 在时间内，但是验证码不正确
                    ctx.body = {
                        code: 400,
                        msg: '验证码不正确'
                    }
                }
            } else {
                ctx.body = {
                    code: 400,
                    msg: '验证码已过期'
                }
            }
        } else { // 没有发送过短信
            ctx.body = {
                code: 400,
                msg: '未发送手机验证码'
            }
        }
    } else {
        ctx.body = {
            code: 400,
            msg: '该账号已经注册'
        }
    }
})

router.post('/phoneValidator', async ctx => {
    try {
        const {phone} = ctx.request.body;
        const validatorStatus = validator.isMobilePhone(phone, 'zh-CN') // 验证手机号码

        let sixCode = '';
        for(let i = 0; i < 6; i++){
            sixCode += Math.floor(Math.random()*10)
        }

        if(validatorStatus) {
            const user = await userModel.findOne({
                phone,
            })

            if(user){ // 找得到用户，说明已经注册过了
                ctx.body = {
                    code: 400,
                    msg: '对不起，您已经注册过了'
                }
            } else { // 找不到用户，才发送验证码
                const {Code: smsCode} = await smsClient({
                    phone,
                    code: sixCode
                })
                console.log(smsCode, 'smsCode');
                console.log(smsCode, 'smsCode');
                if(smsCode == 'OK'){
                    await smsModel.create({phone, sixCode: sixCode})
                    ctx.body = {
                        code: 200,
                        msg: '验证码发送成功'
                    }
                } else {
                    ctx.body = {
                        code: smsCode,
                        msg: '短信发送过于频繁'
                    }
                }
            }
        } else {
            ctx.body = {
                code: '400',
                msg: '手机号格式不正确'
            }
        }
    } catch(err){
        console.log(11111);
        if(err.code == 'isv.BUSINESS_LIMIT_CONTROL'){
            ctx.body = {
                code: 400,
                msg: '短信发送过于频繁'
            }
        } else {
            ctx.body = {
                code: 400,
                msg: err.code
            }
        }
        console.log(err, '处理错误');
    }

})


module.exports = router.routes()
