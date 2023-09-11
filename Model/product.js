const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    productName:{type:String, required:true},
    product_id:{type:String, required:true},
    productPrice:{type:Number, required:true},
    productWeight:{type:Number, required:true},
    productQuantity:{type:Number, required:true},
    productCategory:{type:String, required:true},
    productDescription:{type:String, required:true},
    productImg:{type:[String], required:[true, "imges cannote be empty"]},
    rating : {type : Number, default : 0},
    isAvailable : {type:Boolean , required:true}
})

const ProductCollection = mongoose.model('product', productSchema)

module.exports = ProductCollection