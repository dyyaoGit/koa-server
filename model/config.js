var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://yao:yjr1923521@116.62.145.106:27017/getBook', {useNewUrlParser: true});
var db = mongoose.connection;
db.once("open",() => {
    console.log("数据库连接成功")
})

