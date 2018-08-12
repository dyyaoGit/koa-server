const koa = require('koa')
const app = new koa()
const router = require('./router')
const bodyParser = require('koa-body')
const dbConfig = require('./model/config')
const session = require('koa-session')

app.keys = ['yao']

const CONFIG = {
    key: 'SESSIONID', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    // secure: true,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    // store: {
    //     set: async (key, sess, maxAge, {rolling, changed}) => {
    //         console.log('key', key)
    //         console.log('sess', sess)
    //     },
    //     get: async (key, maxAge, { rolling }) => {
    //         return null
    //     },
    //     destroy: async (key) => {
    //
    //     }
    // }
}

app.use(session(CONFIG, app))
app.use(bodyParser())

app.use(router.routes())

app.listen(3000)




