const UserCollection = require('../Model/user_details')
const ProductCollection = require('../Model/product')

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
        return e
    }
}

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

                const cartSum = await getTotalSum(email)
                console.log(cartSum)
                const total = cartSum[0].total
                res.render('my-cart',{user,dest :'myCart', cartItems :cartItems[0].cartProducts,total})
            }else{
                res.redirect('/user/login')
            }

           
        }catch(e){
            console.log(e)
        }
        
    },
    deleteCartItem : async(req,res)=>{
        try{
            const email = req.session.user
            const product_id = req.params.id
            const updateQuery = {
                $pull : {
                    //removes the object from the cart that having the given product_id
                    cart : { product_id}
                }
            }
            const deletCartItem = await UserCollection.findOneAndUpdate({email},updateQuery)
            const updateTotal = await getTotalSum(email)
            res.json({
                success : true,
                total : updateTotal[0].total
            })
          
        }catch(e){
            console.log(e)
            res.json({message : 'could not complete try again'})
        }
    }
}