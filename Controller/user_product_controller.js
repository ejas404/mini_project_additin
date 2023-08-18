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
    },
    cartPage : async (req,res)=>{
        try{
            
            if(req.session.user){
                const email  = req.session.user;
                const user = await UserCollection.findOne({email})
                const cartItems = await UserCollection.aggregate([
                    {
                        $match : {
                            email
                        }
                    },
                    {
                        $project : {
                            productIds : "$cart.product_id"
                        }
                    },
                    {
                        $lookup :{
                            from : 'products',
                            localField : 'productIds',
                            foreignField : 'product_id',
                            as : 'cartProducts'
                        }
                    },
                    {
                        $project :{
                            cartProducts : 1,
                            _id : 0
                        }
                    }
                ])
                res.render('my-cart',{user,dest :'myCart', cartItems :cartItems[0].cartProducts})
            }else{
                res.redirect('/user/login')
            }

           
        }catch(e){
            console.log(e)
        }
        
    }
}