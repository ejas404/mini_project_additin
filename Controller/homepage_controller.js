const ProductCollection = require('../Model/product')
const CategoryCollection = require('../Model/category')
const BannerCollection = require('../Model/banner_details')
const UserCollection = require('../Model/user_details')
const titleUpperCase = require('../public/scripts/title_uppercase')

module.exports = {
    homepage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true }).skip(num * 3).limit(3)
            const count = await ProductCollection.countDocuments({ isAvailable: true })
            const topBanners = await BannerCollection.find({ name: 'homepage_top_banner' })

            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])

                res.render('index', { isUser: true, products, count, topBanners, cartAndWish })
            } else {
                res.render('index', { products, count, topBanners })
            }

        } catch (e) {
            console.log(e)
        }
    },
    singleProductPage: async (req, res) => {
        try {
            const product_id = req.params.id
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
            console.log('hai')
            let rating;
            if(product[0].productRating?.length){
             const productRating = product[0].productRating
             rating = productRating.reduce((acc, each)=> acc + each.value ,0)
             rating = Math.round(rating/productRating.length)
            
            }
            const productName = (titleUpperCase(product[0].productName))
            if (req.session.user) {
                const email = req.session.user
                const user = await UserCollection.findOne({email, "cart.product_id": product_id})
                return res.render('user-single-product', { product, productName, isUser: true, rating})
            }
            res.render('user-single-product', { product, productName,rating })
        } catch (e) {
            if (e instanceof TypeError) {
                console.log(e)
                res.status(404)
                res.redirect('/404-not-found')
            } else {
                console.log(e)
            }
        }
    },
    pagination: async (req, res) => {
        try {
            console.log('hai')
            const num = req.params.num
            const products = await ProductCollection.find({ isAvailable: true }).skip(num * 3).limit(3)
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                let cart = cartAndWish[0].cartIds
                let wishlist = cartAndWish[0].wishListIds
                return res.json({
                    success: true,
                    isUser: true,
                    products,
                    cart,
                    wishlist,
                })

            }
            return res.json({
                success: true,
                products
            })
        } catch (e) {
            console.log(e)
            res.json({
                err: e.message
            })
        }
    },
    productsPage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true })
            const count = await ProductCollection.countDocuments({ isAvailable: true })
            const categories = await CategoryCollection.find()
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                res.render('products', { isUser: true, products, count, categories, cartAndWish })
            } else {
                res.render('products', { products, count, categories })
            }

        } catch (e) {
            console.log(e)
        }
    },
    sort: async (req, res) => {
        try {
            const sortField = req.params.value
            let sortObj = {}
            if (sortField === 'productName') {
                sortObj.productName = 1
            } else if (sortField === 'productPrice') {
                sortObj.productPrice = 1
            } else {
                const products = await ProductCollection.find({ productName: { $regex: sortField } })
                   return res.json({
                        success: true,
                        products
                    })
    
            }
            const products = await ProductCollection.find({ isAvailable: true }).sort(sortObj)
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                res.json({
                    success: true,
                    products,
                    cartAndWish
                })
            } else {
                res.json({
                    success: true,
                    products
                })
            }

        } catch (e) {
            console.log(e)
        }
    },
    filter: async (req, res) => {
        console.log(req.query)
        try {
            if (Object.keys(req.query).length === 0) {
                console.log("No filters selected");
                return res.redirect('/products');
            }

            //setting query for category
            let category = Array.isArray(req.query.categoryName) ? req.query.categoryName : [req.query.categoryName];
            if (category[0]) {
                category = { productCategory: { $in: category } }
            } else {
                category = { productCategory: { $exists: true } }
            }

            let priceRange = req.query.priceRange;
            let priceQuery;

            switch (priceRange) {
                case 'above-10000':
                    priceQuery = { $gt: 10000 };
                    break;
                case '5000-10000':
                    priceQuery = { $gt: 5000, $lte: 10000 };
                    break;
                case '4000-5000':
                    priceQuery = { $gte: 4000, $lte: 5000 };
                    break;
                case '3000-4000':
                    priceQuery = { $gte: 3000, $lte: 4000 };
                    break;
                case '2000-3000':
                    priceQuery = { $gte: 2000, $lte: 3000 };
                    break;
                case '1000-2000':
                    priceQuery = { $gte: 1000, $lte: 2000 };
                    break;
                case 'above-500':
                    priceQuery = { $gt: 500 };
                    break;
                default:

                    break;
            }

            let price;
            if (priceRange) {
                price = { productPrice: priceQuery }
            } else {
                price = { productPrice: { $exists: true } }
            }

            const cartAndWish = await UserCollection.aggregate([
                {
                    $match: {
                        email: req.session.user
                    }

                },
                {
                    $project: {
                        cartIds: '$cart.product_id',
                        wishListIds: '$wishlist.product_id'
                    }
                }
            ])

            const products = await ProductCollection.find({ ...price, ...category, ...{ isAvailable: true } })
            console.log(products)
            const categories = await CategoryCollection.find()
            res.render('products', { products, categories, isUser: true, cartAndWish })
        } catch (e) {
            console.log(e)
        }
    },
    search: async (req, res) => {
        try {
            console.log('hai')
            const productNames = await ProductCollection.find({ isAvailable: true }, { productName: 1, _id: 0 })
            console.log(productNames)
            res.json({
                success: true,
                productNames
            })
        } catch (e) {
            console.log(e)
        }
    }
}