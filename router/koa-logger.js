exports.logger = async (ctx, next) => {
    let str = ctx.url + ' ' + ctx.method + ' '
    await next()
    console.log(str + ctx.status)
}