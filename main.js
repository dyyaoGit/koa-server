const koa = require('koa')
const app = new koa()
const router = require('./router') 
const bodyParser = require('koa-body')
const dbConfig = require('./model/config')

app.use(bodyParser())

app.use(router.routes())

app.listen(3000)



