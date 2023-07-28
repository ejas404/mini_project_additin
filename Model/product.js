const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    productName:{type:String, required:true},
    product_id:{type:Number, required:true},
    productPrice:{type:Number, required:true},
    productWeight:{type:String, required:true},
    productQuantity:{type:String, required:true},
    productCategory:{type:String, required:true},
    productDescription:{type:String, required:true},
    productImg:{type:String},
})

const ProductCollection = new mongoose.model('product', productSchema)

module.exports = ProductCollection