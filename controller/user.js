const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')

router.post('/login', async (ctx, next) => {
    ctx.body = {
        code: 200,
        token: jwt.sign({user: 'Alex',data: 'newMsg'}, 'yaoyaoyao',{expiresIn: 60*60*24*30})
    }

    await next()

})

module.exports = router.routes()
