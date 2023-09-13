const mongoose = require('mongoose')
const Schema = mongoose.Schema()

const paymentSchema = new Schema({
    orderId: { type: String,required: true},
    user_id : {type : String, required : true},
    paymentId: {type: String,required: true},
    razorpayOrderId: { type: String, required: true},
    paymentSignature: {type: String},
    refund: {type: Boolean,default: false},
    refundId: {type: String}
})