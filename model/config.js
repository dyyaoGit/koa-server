var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/getBook', {useNewUrlParser: true});
var db = mongoose.connection;
db.once("open",() => {
    console.log("数据库连接成功")
})