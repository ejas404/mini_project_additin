const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    user_id : {type:Number, required:true},
    houseName : {type:String, required:true},
    streetAddress : {type:String, required:true},
    city : {type:String, required:true},
    state : {type:String, required:true},
    postalcode : {type:Number, required:true},
    mobile : {type:Number, required : true}
})

const AddressCollection = mongoose.model('addres',addressSchema)
module.exports = AddressCollection