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
<<<<<<< Updated upstream
    productImg:{type:[String], required:[true, "imges cannote be empty"]},
=======
    productImg:{type:[String], required:[true, "imges cannot be empty"]},
    productRating : {type :[{key:String, value : Number}]},
>>>>>>> Stashed changes
    isAvailable : {type:Boolean , required:true}
})

const ProductCollection = mongoose.model('product', productSchema)

module.exports = ProductCollection