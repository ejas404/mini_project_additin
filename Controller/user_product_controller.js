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
        const product_id = req.params.id
        const email = req.session.user
        const isCartItem = await UserCollection.findOne({email, 'cart.product_id' : product_id})
        // if(isCartItem){
        //     return res.json({
        //         msg : 'product alredy exist',
        //         success : true
        //     })
        // }
        const product = await ProductCollection.findOne({product_id})
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
                        $lookup :{
                            from : 'products',
                            localField : 'cart.product_id',
                            foreignField : 'product_id',
                            as : 'cartItems'
                        }
                    },
                    {
                        $project :{
                              combined:{
                                $concatArrays:['$cart','$cartItems']
                              }
                        }
                    },
                    {
                        $unwind:'$combined'
                    },
                    {
                        $group:{
                            _id:'$combined.product_id',
                            items:{
                                $push:"$combined"
                            }
                        }
                    },
                    {
                        $project:{
                            'items.quantity':1,
                            product:{
                                $arrayElemAt:['$items',1]
                            }
                        }
                    }
                ])
                console.log('hai')
                console.log(cartItems)
                const cartSum = await getTotalSum(email)
                let total = cartSum[0]?.total
                if(!total){
                    total = 0
                }
                res.render('my-cart',{user,dest :'myCart', cartItems,total})
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
            let total = updateTotal[0]?.total
            if(!total){
                total = 0
            }
            
            res.json({
                success : true,
                total 
            })
          
        }catch(e){
            console.log(e)
            res.json({message : 'could not complete try again'})
        }
    },
    updateCartItemQty : async(req,res)=>{
       try{
        let email = req.session.user
        let quantity = Number(req.query.quantity)
        let product_id = req.query.p_id
        let updateQuantity  = await UserCollection.findOneAndUpdate(
            {
                email,'cart.product_id': product_id
            },
            {
                $set:{
                    'cart.$.quantity':quantity
                }
            })
        let total = await getTotalSum(email)
            res.json({
                success : true,
                total : total[0].total
            })
       }catch(e){
            console.log(e)
            res.json({
                message : 'could not complete'
            })
       }
    },
    addToWishList : async (req,res)=>{
        try{
            const product_id = req.params.id
            const email = req.session.user
            const product = await ProductCollection.findOne({product_id})
            const userWishList = await UserCollection.findOne({email},{wishlist : 1})
            console.log(userWishList)
            for(let each of userWishList.wishlist){
                if(each.product_id === product.product_id){
                    let removedList = await UserCollection.findOneAndUpdate({email},
                        {
                            $pull : {
                                wishlist:{
                                    product_id : each.product_id
                                }
                            }
                        }
                    )

                    return res.json({
                        success : true,
                        msg : 'removed'
                    })
                }
            }
            const listItem = {
                product_id : product.product_id,
            }
            const wishList = await UserCollection.findOneAndUpdate({email},{$push : { wishlist : listItem }})
            return  res.json({
                success: true,
                msg : 'added'
            })
        }catch(e){
                console.log(e)
                return res.json({error : e.message})
           }
    },
    wishListPage : async (req,res)=>{
        try{
            const email = req.session.user
        const userWishlist = await UserCollection.aggregate([
            {
                $match : {
                    email
                },
                
            },
            {
                $lookup : {
                    from : 'products',
                    localField : 'wishlist.product_id',
                    foreignField : 'product_id',
                    as : 'wishListItems'
                }
            },
            {
                $project : {
                    userDetails : {
                        name : '$name',
                        email : '$email'
                    },
                    cartIds : '$cart.product_id',
                    wishListItems : 1,
                }
            }
        ])

        console.log(userWishlist)
        res.render('wishlist',{user : userWishlist[0].userDetails,
            dest :'wishlist', wishListItems : userWishlist[0].wishListItems,
            cartIds : userWishlist[0].cartIds})
        }catch(e){
            console.log(e)
        }
    }, singleProduct: async (req, res) => {
        try {
            console.log('hai')
            req.session.product_id = req.params.id
            const product_id = req.params.id
            const product = await ProductCollection.findOne({ product_id })
            res.redirect('/user/' + product.productName)
        } catch (e) {
            console.log(e)
        }


    },
    singleProductPage: async (req, res) => {
        const product_id = req.session.product_id
        const product = await ProductCollection.aggregate([
            {
                $match: {
                    product_id
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productCategory',
                    foreignField: 'category_id',
                    as: 'category'
                }
            }


        ])
        console.log(product)
        const productName = (titleUpperCase(product[0].productName))
        res.render('user-single-product', { product, productName })
    }
   
} 