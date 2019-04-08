const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const { wxApi, secret,authType, decodeToken } = require('../util/index')
const userModel = require('../model/user')
const smsClient = require('../sms/main')
const validator = require('validator')
const smsModel = require('../model/sms')
const likeModel = require('../model/like')
const collectionModel = require('../model/bookCollection')
const readListModel = require('../model/readList')
const ObjectId = require('mongoose').Types.ObjectId
// const cors = require('koa-cors')

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
        userData = await decodeToken(token)
    } catch (err) {
        ctx.body = {
            code: 401,
            msg: err
        }
        throw Error(err)
    }
    console.log(userData)
    let user = await userModel.findById(ObjectId(userData.userId))
    console.log(userData)
    console.log(user, 'user')
    if (!user) {
        ctx.body = {
            code: 403,
            msg: '用户不存在'
        }
        return
    }
    const likeCount = await likeModel.countDocuments({
        user: userData.userId
    })
    const collectionCount = await collectionModel.countDocuments({
        user: userData.userId
    })
    const readCount = await readListModel.countDocuments({
        user: userData.userId
    })

    ctx.body = {
        code: 200,
        // msg:
        data: {
            user,
            like: likeCount+'',
            read: readCount+'',
            collection: collectionCount + ''
        }
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
    const {password, phone, code} = ctx.request.body
    console.log(1);

    console.log(ctx.request.body);

    if(!phone||!password||!code){
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
                        password,
                        phone,
                        open_id: Date.now() + ''
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

// 修改个人信息开始
router.put('/user', async ctx => {
    try {
        const {token} = ctx.request.headers||ctx.request.body||''
        const userData = await decodeToken(token)
        const body = ctx.request.body
        const keys = Object.keys(body)
        const key = keys[0]
        const changeProp = body[key]
        console.log(body)

        if(userData){
            if(key== 'password'){
                ctx.body = {
                    code: 400,
                    msg: '密码不能通过修改个人信息接口修改'
                }
                return
            }
            const updateData = await userModel.update({_id: userData.userId},{$set: {[key]: changeProp}})

            console.log(updateData);
            // const findUser = await userModel.findOne({_id: userData.userId})
            // console.log(findUser);
            // console.log(changeProp, 'changeProp');
            // console.log(key, 'key');
            // await findUser.$set({key: changeProp})
            // await findUser.save()
            ctx.body = {
                code: 200,
                msg: `${key}修改成功`
            }
        } else {
            ctx.body = {
                code: 401,
                msg: '用户未登录'
            }
        }


    } catch(err){
        console.log(err);
        ctx.body = {
            msg: err.code,
            code: 500
        }
    }
})

// 修改个人信息结束


module.exports = router.routes()
