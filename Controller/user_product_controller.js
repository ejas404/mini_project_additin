const UserCollection = require('../Model/user_details')
const ProductCollection = require('../Model/product')

module.exports = {
    addToCart : async(req,res)=>{
       try{
        console.log(`id ${req.params.id}`)
        console.log(req.session)
        const product_id = req.params.id
        const email = req.session.user
        const product = await ProductCollection.findOne({product_id})
        console.log(product)
        const cart = {
            product_id : product.product_id,
            quantity : 1,
            price : product.productPrice
        }
        const user = await UserCollection.findOneAndUpdate({email},{$push : {cart : cart}})
        console.log(user)
        return  res.json({
            successMsg: true,
            redirect: '/'
        })
    }catch(e){
            console.log(e)
            return res.json({error : e.message})
       }
    }
}