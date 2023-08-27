const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    user_id : {type : String, required:true},
    couponType : {type : String, required : true},
    couponCode : {type : String, required : true},
    couponValue : {type : Number,required : true},
    expiryDate : {type : Date, required : true}
})

const CouponCollection = mongoose.model('coupons',couponSchema)
module.exports = CouponCollection