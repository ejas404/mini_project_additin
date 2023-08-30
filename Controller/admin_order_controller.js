const OrderCollection = require('../Model/order')
const UserCollection = require('../Model/user_details')
module.exports = {
    ordersPage : async (req,res)=>{
        try{
            const orders = await OrderCollection.find({})
            res.render('admin-orders',{orders,isAdmin:true})
        }catch(e){
            console.log(e)
        }
    },
    orderConfirm : async(req,res)=>{
        try{
            const order_id = req.params.id
            const orderUpdate = await OrderCollection.findOneAndUpdate({order_id},{$set:{orderStatus : 'confirmed'}})
            console.log(orderUpdate)
            res.redirect('/admin/orders')
        }catch(e){
            console.log(e)
        }
    },
    orderCancel : async (req,res)=>{
        try{
            const order_id = req.params.id
            const cancelOrder = await OrderCollection.findOneAndUpdate({order_id},{$set:{isCancelled : true,orderStatus:'cancelled'}})
            console.log(cancelOrder)
            res.redirect('/admin/orders')
        }catch(e){
            console.log(e)
        }
    },
    orderMore : async(req,res)=>{

    }

}