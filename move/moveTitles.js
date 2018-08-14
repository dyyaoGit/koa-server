const mongoose = require('mongoose')
const config = require('../model/config')

const titleModel = require('../model/titles')
const bookModel = require('../model/book')
const articleModel = require('../model/articles')
const ObjectId = mongoose.Types.ObjectId

// 5b6ca00ffeeb050664fe8578  ariticle
//5b6ca00ffeeb050664fe853a   title
//5b6ca00ffeeb050664fe8539  book

// async function go () {
//     const articles = await articleModel.find()
//     for (let article of articles) {
//         const title = await titleModel.findById(ObjectId(article.titleId))
//         await article.set({bookId: ObjectId(title.bookId),index: title.index})
//         const newArticle = await article.save()
//     }
//     console.log('done')
//
//
// }
// go()

// articleModel.findOne().populate({path: 'bookId'}).then(res => {
//     console.log(res)
// })

async function changeTitle () {
    const books = await bookModel.find()
    console.log(books.length)
    for(let book of books) {
        const bookId = book._id
        const titles = await titleModel.find({bookId: bookId})
        const length = titles.length
        await titleModel.updateMany({bookId: bookId}, {$set: {total: length}})

        // titleModel.update({bookId: bookId},{$set: {to}})


    }
    console.log('完成')
}

changeTitle()
