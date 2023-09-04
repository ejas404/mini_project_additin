const AdminCollection = require('../Model/admin_details')
const OrderCollection = require('../Model/order')
const ProductCollection = require('../Model/product')
const CategoryCollection = require('../Model/category')
const UserCollection = require('../Model/user_details')

const { v4: uuidv4 } = require('uuid');

module.exports = {
    adminLogin: async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await AdminCollection.findOne({})

            if (admin.email === email && admin.password === password) {
                req.session.isAdmin = 'hai admin'
                console.log('after')
                res.redirect('/admin/dashboard')
            } else {
                res.render('admin-login', { message: 'invalid user name or password', isAdmin: true })
            }
        } catch (e) {
            console.log(e)
        }

    },

    // renders login page
    loginPage: async (req, res) => {
        res.render('admin-login', { isAdmin: true })
    },

    dashboard: async (req, res) => {
        try {   
            const userCount = await UserCollection.countDocuments({})
            const orderCount = await OrderCollection.countDocuments({})
            const productCount = await CategoryCollection.countDocuments({})

            const dashboardData = {
                userCount,
                orderCount,
                productCount
            }
            console.log(dashboardData)

            res.render('dashboard', { isAdmin: true ,dashboardData})
        } catch {
            console.log(e)
        }
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('error occured during destroying session')
            } else {
                console.log('session destroyed')
            }
        })
        res.redirect('/admin/login')
    },
    chartData: async (req, res) => {
        try {
            const confirmCount = await OrderCollection.countDocuments({ orderStatus: 'confirmed' })
            const cancelledCount = await OrderCollection.countDocuments({ orderStatus: 'cancelled', isCancelled: true })
            const pendingCount = await OrderCollection.countDocuments({ orderStatus: 'pending' })

            const categoryList = await CategoryCollection.find({})
            const products = await ProductCollection.find({ isAvailable: true })

            const categoryCount = []
            const categoryNames = []
            for (let each of categoryList) {
                //filters products in the basis of category name and stores its count as categryCount
                const count = products.filter((product) => product.productCategory === each.category_id).length
                categoryCount.push(count)

                //category names pushing in array in order
                categoryNames.push(each.categoryName)
            }

            const orderStatusLabel = ['confirmed', 'cancelled', 'pending']
            const orderStatusData = [confirmCount, cancelledCount, pendingCount];

            return res.json({
                success: true,
                orderStatusData,
                orderStatusLabel,
                categoryCount,
                categoryNames
            })
        } catch (e) {
            res.err = e.message
            console.log(e)
        }
    }

}