const AdminCollection = require('../Model/admin_details')
const UserCollection = require('../Model/user_details')
const ProductCollection = require('../Model/product')
const CategoryCollection = require('../Model/category')
const subCategoryCollection = require('../Model/sub_category')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    adminLogin: async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await AdminCollection.findOne({})

            if (admin.email === email && admin.password === password) {
                console.log('before')
                console.log(req.session)
                req.session.isAdmin = 'hai admin'
                console.log('after')
                res.redirect('/admin/dashboard')
            } else {
                res.render('admin-login', { message: 'invalid user name or password' })
            }
        } catch (e) {
            console.log(e)
        }

    },

    // renders login page
    loginPage: async (req, res) => {
        res.render('admin-login')
    },

    dashboard: (req, res) => {
        res.render('dashboard')
    },

    //to get user datas from the database
    userLists: async (req, res) => {

        try {
            const userDatas = await UserCollection.find({})

            res.render('userlists', { datas: userDatas })


        } catch (e) {
            console.log(e.message)
        }

    },
    addProductPage: async (req, res) => {
        const category = await CategoryCollection.find({}, { categoryName: 1 })
        res.render('add-product', { category: category })
    },
    addProduct: async (req, res) => {
        try {
            console.log(req.body.category)
            const categoryDoc = await CategoryCollection.findOne({ categoryName: req.body.category })
            const productData = {

                productName: req.body.product_name,
                product_id: uuidv4(),
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productCategory: categoryDoc.category_id,
                productDescription: req.body.description,
                productImg: req.file.path

            }

            const isExistProduct = await ProductCollection.findOne({ productName: req.body.product_name, productWeight: req.body.weight })
            console.log(isExistProduct)
            if (isExistProduct) {
                const category = await CategoryCollection.find({}, { categoryName: 1 })
                res.render('add-product', { category: category, message: 'product already exist !', class: 'error-message' })
            }
            console.log('before adding')
            const newProduct = await ProductCollection.create(productData)
            console.log(newProduct)
            const category = await CategoryCollection.find({}, { categoryName: 1 })
            res.render('add-product', { category: category, message: 'product added successfully !', class: 'green' })

        } catch (e) {
            console.log(e)
        }
    },
    addCategory: async (req, res) => {
        const { name, description } = req.body
        console.log(req.body)
        try {
            const isExistCategory = await CategoryCollection.findOne({ categoryName: name })
            if (isExistCategory) {
                return res.send('category already existing')
            }

            const newCategory = await CategoryCollection.create({
                category_id: uuidv4(),
                categoryName: name,
                categoryDesc: description
            })

            res.send('category added')

        } catch (e) {
            console.log(e)
        }


    },
    addCategoryPage: (req, res) => {
        res.render('add-category', { h2: 'Add Category' })
    },

    productsPage: async (req, res) => {
        try {
            const products = await ProductCollection.aggregate([{
                '$lookup': {
                    'from': "categories",
                    'localField': "productCategory",
                    'foreignField': "category_id",
                    'as': "category"
                }
            }])
            const categories = await CategoryCollection.find()
            res.render('admin-products', { products, categories })
        } catch (e) {
            console.log(e)
        }
    },
    filterProducts: async (req, res) => {
        try {
            const id = req.params.id
            const filteredProduct = await ProductCollection.aggregate([
                {
                  $match: {
                    productCategory: id,
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "productCategory",
                    foreignField: "category_id",
                    as: "category",
                  },
                },
              ]);
              

              const categories = await CategoryCollection.find()
              res.render('admin-products', { products : filteredProduct, categories })
        } catch (e) {

        }
    }

}