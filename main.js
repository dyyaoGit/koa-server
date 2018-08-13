const koa = require('koa')
const router = require('./router')
const bodyParser = require('koa-body')
const dbConfig = require('./model/config')
const jwt = require('koa-jwt')
const session = require('koa-session')

const app = new koa()
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'SESSIONID', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


app.use(session(CONFIG, app));

app.use(bodyParser())

app.use(router.routes())

app.listen(3000)




