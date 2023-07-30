const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subCategorySchema = new Schema({
    category_id : {type:String , required:true},
    categoryName: {type:String, required:true},
    categoryDesc: {type:String, required:true}
})

const subCategoryCollection = mongoose.model('subcategory',subCategorySchema)
module.exports = subCategoryCollection;