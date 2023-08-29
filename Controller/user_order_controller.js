const UserCollection = require('../Model/user_details')
const AddressCollection = require('../Model/address_details')
const ProductCollection = require('../Model/product')
const OrderCollection = require('../Model/order')
const CouponCollection = require('../Model/coupon')

const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb')

const getTotalSum = async (email)=> {
    try{

        const cartSum = await UserCollection.aggregate([
            {
                $match:{
                    email
                }
            },
            {
                $unwind : '$cart'
            },
            {
                $lookup : {
                    from :'products',
                    localField : 'cart.product_id',
                    foreignField : 'product_id',
                    as : 'cartProducts'
                }
            },
            {
                $unwind : '$cartProducts'
            },
            {
                $match:{
                    'cartProducts.isAvailable':true
                } 
            },
            {
                $project : {
                    _id : 0,
                    each : {
                        $multiply : ['$cart.quantity','$cartProducts.productPrice']
                    }
                },
               
            },
            {
                $group : {
                    _id : null,
                    total : {
                        $sum : '$each'
                    }
                }
            }
        ])

        return cartSum

    }catch(e){
        console.log(e)
        return false
    }
}


module.exports = {
    proceedCart : async (req,res)=>{
        try{
 
            const email = req.session.user
            const cartTotal = await getTotalSum(email)
            const user = await UserCollection.findOne({email})
            
            const cartOrder = {
                total : cartTotal[0].total,
                count : user.cart.length
            }
            req.session.cartOrder = cartOrder
            res.redirect('/user/payment')
        }catch(e){
            console.log(e)
        }
    },
    selelctAddress : async(req,res)=>{
        const email = req.session.user
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

    },
   
    buyNowPage: async (req, res) => {
        const email = req.session.user
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

        const product_id = req.params.id
        const product = await ProductCollection.findOne({ product_id })
       
        const user = { name: userAddress[0].name }
        req.session.buynow = true
        req.session.buynowP_id = product_id
        res.render('buy-now', { address: userAddress[0].address, product, isUser: true, user })
    },
    buyNow: async (req, res) => {
        try {
            if (!req.body.address) {
                res.render('buy-now', { address: userAddress[0].address, product, isUser: true, user, msg: 'please add your address to proceed' })
            }
            const _id = new ObjectId(req.body.address)
            const isAddress = await AddressCollection.findOne({ _id })
            const order = {
                product_id: req.session.buynowP_id,
                quantity: req.body.quantity
            }
            req.session.buynowP_id = null;
            if (isAddress) {
                order.addressId = _id
            }
            req.session.orderDetails = order

            res.redirect('/user/payment')
        }
        catch (e) {
            console.log(e)
        }
    },
    selectPayment: async (req, res) => {
        try {
            if(req.session.cartOrder.total){
                const email = req.session.user
                const user = await UserCollection.findOne({ email })
                const coupons = await CouponCollection.find({ user_id: user.user_id })
                const total = req.session.cartOrder.total
                const count = req.session.cartOrder.count

                return  res.render('select-payment', { isUser: true, coupons, total, count })      
            }
            const order = req.session.orderDetails
            const email = req.session.user
            const user = await UserCollection.findOne({ email })
            const product = await ProductCollection.findOne({ product_id: order.product_id })

            let total = product.productPrice * Number(order.quantity)
            total = total > 5000 ? total : total + 40;

            const count = 1
            const coupons = await CouponCollection.find({ user_id: user.user_id })
             return res.render('select-payment', { isUser: true, coupons, total, count })
        }
        catch (e) {
            req.session.cartOrder = null
            console.log(e)
        }
    },
    couponUpdate: async (req, res) => {
        try {
            
            let total 
            if(req.session.cartOrder.total){
                total = req.session.cartOrder.total
            }else{
            const order = req.session.orderDetails
            const product = await ProductCollection.findOne({ product_id: order.product_id })
    
            total = product.productPrice * Number(order.quantity)
            total = total > 5000 ? total : total + 40;
            }

            const _id = new ObjectId(req.params.id)
            const coupon = await CouponCollection.findOne({ _id })
            if (coupon.couponType === 'percent') {
                total = (total * coupon.couponValue) / 100
            } else {
                total = total - coupon.couponValue
            }
            res.json({
                success: true,
                total,
                coupon
            })
        } catch (e) {
            console.log(e)
            res.json({
                success: false,
                err: e.message
            })
        }
    },
    createOrder: async (req, res) => {
        try {
            console.log(req.session.orderDetails)
            console.log(req.body)
            const {paymentMethod,discountCoupon} = req.body
            const { product_id, quantity, addressId } = req.session.orderDetails
            let address_id = new ObjectId(addressId)
            const userDetails = await AddressCollection.aggregate([
                {
                    $match: {
                        _id: address_id
                    }
                },
                {
                    $project: {
                        _id: 0,
                        address: {
                            houseName: "$houseName",
                            streetAddress: "$streetAddress",
                            city: "$city",
                            state: "$state",
                            postalcode: "$postalcode"
                        },
                        mobile: 1,
                        user_id: 1
                    }
                }
            ])
            let product = await ProductCollection.aggregate([
                {
                    $match: {
                        product_id
                    }
                },
                {
                    $project: {
                        _id : 0,
                        product: {
                            productName: '$productName',
                            product_id: '$product_id',
                            weight: '$productWeight',
                            price: '$productPrice'
                        }
                    }
                }

            ])
            product = product[0].product
            product.quantity = Number(quantity)

            let total = product.price * Number(quantity)
            total = total > 5000 ? total : total + 40;
            let coupon
            if(discountCoupon){
                const _id = new ObjectId(discountCoupon)
                coupon = await CouponCollection.findOne({_id})
                if(coupon.couponType === 'percent'){
                   total = (total*coupon.couponValue)/100
                }else{
                    total = total - coupon.couponValue
                }
            }
            

            const newOrderData = {
                order_id : uuidv4(),
                user_id : userDetails[0].user_id,
                address : userDetails[0].address,
                mobile : userDetails[0].mobile,
                items:[product],
                total : total,
                paymentMethod : paymentMethod
            }

            if(coupon){
                newOrderData.coupon = coupon.couponCode
            }
            const newOrder = await OrderCollection.create(newOrderData)
            req.session.orderDetails = null;
            req.session.newOrder = newOrder._id
            res.redirect('/user/order-completed')
        } catch (e) {
            res.redirect('/user/order-failed')
            console.log(e)
        }
    },
    orderCompleted : (req,res)=>{
        res.render('order-completed',{isUser : true})
    },
    orderFailed : (req,res)=>{
        res.render('order-failed',{isUser:true})
    },
    myOrders : async (req,res)=>{
        try{
            const user = await UserCollection.findOne({email : req.session.user})
            console.log(user)
            // const userOrders = await OrderCollection.aggregate([
            //     {
            //         $match : {
            //             user_id : user.user_id
            //         }
            //     },
            //     {
            //         $lookup : {
            //             from : 'products',
            //             localField : 'items.product_id',
            //             foreignField : 'product_id',
            //             as : 'products'
            //         }
            //     },
            //     {
            //         $project : {
            //             products : 1,
            //             items : 1,
            //             total : 1,
            //             orderStatus : 1
            //         }
            //     },
            //     {
            //         $unwind : '$products'
            //     }
            // ])

            // console.log(userOrders)
            res.end('done')            
            
            //res.render('my-orders',{dest:'myOrder', isUser:true})
        }catch(e){
            console.log(e)
        }
    }
}
