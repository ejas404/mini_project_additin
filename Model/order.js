const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    order_id: { type: String, required: true },
    user_id: { type: String, required: true },
    address: {
        houseName: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalcode: { type: String, required: true },
    },
    mobile: { type: String, required: true },
    items: {
        type: [
            {
                productName: { type: String, required: true },
                product_id: { type: String, required: true },
                productWeight : {type: Number, required : true},
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
            }
        ]
    },
    total : {type : Number, required : true},
    couponCode : {type : String},
    paymentMethod :{type : String , required : true}, 
    isCancelled : {type: Boolean, default : false},

})

const OrderCollection = mongoose.model('orders',orderSchema)
module.exports = OrderCollection