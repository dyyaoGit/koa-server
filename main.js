const koa = require('koa')
const router = require('./router')
const bodyParser = require('koa-body')
const dbConfig = require('./model/config')
const jwt = require('koa-jwt')

const app = new koa()

app.use(bodyParser())

app.use(router.routes())

app.listen(3000)




