const UserCollection = require('../Model/user_details')
const AddressCollection = require('../Model/address_details')
const ProductCollection = require('../Model/product')
const OrderCollection = require('../Model/order')
const CouponCollection = require('../Model/coupon')


const { ObjectId } = require('mongodb')

module.exports = {
    buyNowPage: async (req, res) => {
        const email = req.session.user
        const product_id = req.params.id
        const product = await ProductCollection.findOne({ product_id })
        const userAddress = await UserCollection.aggregate([
            {
                $match: {
                    email
                }
            },
            {
                $lookup: {
                    from: 'addres',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'address'
                }
            },
            {
                $project: {
                    address: 1,
                    name: 1
                }
            }
        ])

        const user = { name: userAddress[0].name }
        req.session.buynow = true
        req.session.buynowP_id = product_id
        res.render('buy-now', { address: userAddress[0].address, product, isUser: true, user })
    },
    buyNow: async (req, res) => {
        console.log(req.body)
        try {
            if (!req.body.address) {
                res.render('buy-now', { address: userAddress[0].address, product, isUser: true, user, msg: 'please add your address to proceed' })
            }
            const _id = new ObjectId(req.body.address)
            const isAddress = await AddressCollection.findOne({_id})
            const order = {
                product_id : req.session.buynowP_id,
                quantity : req.body.quantity
            }
            req.session.buynowP_id = null;
            if(isAddress){
                order.addressId = _id
            }
            req.session.orderDetails = order
            console.log(req.session.orderDetails)

            res.redirect('/user/payment')
        } 
        catch(e){
            console.log(e)
        }
    },
    selectPayment : async(req,res)=>{
        try {
        const order = req.session.orderDetails
        const email = req.session.user
        const user = await UserCollection.findOne({email})
        const coupons = await CouponCollection.find({user_id : user.user_id})
        const product = await ProductCollection.findOne({product_id : order.product_id})
        
        let total = product.productPrice * Number(order.quantity)
         total = total>5000 ? total : total+40;
        
        console.log(req.session.orderDetails)
        res.render('select-payment',{isUser : true, coupons, total,count : 1})
        } 
        catch(e){
            console.log(e)
        }
    }
}
