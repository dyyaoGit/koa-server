const koa = require('koa')
const router = require('./router')
const bodyParser = require('koa-body')
const dbConfig = require('./model/config')
const jwt = require('koa-jwt')
const session = require('koa-session')
const sessionModel = require('./model/session')

const app = new koa()
app.keys = ['dyyaoSecret'];

const CONFIG = {
    key: 'SESSIONID', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: false,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
       /** (boolean) signed or not (default true) */
    rolling: true,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    // store: {
    //     get: async (key, maxAge, {rolling}) => {
    //         console.log(key)
    //         const session = await sessionModel.findOne({key})
    //         if (!session) {
    //             return null
    //         } else {
    //             return session.session
    //         }
    //     },
    //     set: async (key, session, maxAge, obj) => {
    //         console.log('set', key, obj, session, maxAge)
    //         const  data = await sessionModel.findOne({key})
    //         if(data){
    //             let newSession = {
    //                 ...data.session,
    //                 ...session,
    //             }
    //             console.log('new', newSession)
    //             await data.update({$set: {session: newSession, createTime: new Date()}})
    //         }
    //         else {
    //             await sessionModel.create({key, session, createTime: new Date()})
    //         }
    //         // await sessionModel.updateOne({key},{$set:{key, session, createTime: new Date()}},true)
    //     },
    //     destroy: async (key) => {
    //         await sessionModel.remove({key})
    //     }
    // }
};


// app.use(session(CONFIG, app))
// app.use((ctx, next) => {
//     console.log(ctx.response.header)
//     next()
// })

app.use(bodyParser())

app.use(router.routes())

app.listen(3000)
