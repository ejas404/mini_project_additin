const express = require('express');
const router = express.Router();


const adminController = require('../Controller/admin_controller');
const adminProductController = require('../Controller/admin_product_controller')
const adminUserController = require('../Controller/admin_user_controller')
const adminHomepageController = require('../Controller/admin_homepagecontroller')
const adminOrderController = require('../Controller/admin_order_controller')
const adminMiddleWare = require('../Middlewares/admin_midlle')


router.get('/login',adminController.loginPage )
router.post('/login',adminController.adminLogin)

router.get('/logout',adminController.logout)

router.post('/sales-data',adminController.salesData)
router.get('/createPdf',adminController.createPdf)
router.use(adminMiddleWare.isAdmin)

router.get('/userlists',adminUserController.userLists)
router.get('/user/more/:id',adminUserController.userMoreDetails)
router.get('/user/block/:id',adminUserController.blockUser)
router.get('/user/unblock/:id',adminUserController.unBlockUser)

router.get('/add-category', adminProductController.addCategoryPage)
router.post('/add-category',adminProductController.addCategory)

router.get('/add-product',adminProductController.addProductPage)
router.post('/add-product',adminMiddleWare.uploadProductImg.array('img-file',{maxCount : 3}),adminProductController.addProduct)

router.get('/others',adminProductController.othersPage)
router.post('/edit-banner',adminMiddleWare.bannerUpload.array('banner-img',{maxCount : 3}),adminHomepageController.editBanner)
router.get('/edit-banner/:path',adminHomepageController.editBannerPage)

router.get('/orders',adminOrderController.ordersPage)
router.get('/order-confirm/:id',adminOrderController.orderConfirm)
router.get('/order-cancel/:id',adminOrderController.orderCancel)
router.get('/order-more/:id',adminOrderController.orderMore)

router.get('/products/unblock/:id',adminProductController.productUnblock)
router.get('/products/block/:id',adminProductController.productBlock)

router.get('/dashboard',adminController.dashboard)
router.get('/sales-report',adminController.salesReportPage)
// router.get('/download/:name',adminController.downloadPdf)


router.get('/chart-data',adminController.chartData)
router.get('/products',adminProductController.productsPage)
router.get('/products/:id', adminProductController.filterProducts)

router.get('/products/edit/:id',adminProductController.productEditPage)
router.post('/products/edit/:id',adminMiddleWare.uploadProductImg.single('img-file'), adminProductController.productEdit)

router.get('/product-details/:id',adminProductController.singleProduct)
router.get('/product/:productname', adminProductController.singleProductPage)

router.get('/create-coupon',adminUserController.createCouponPage)
router.post('/create-coupon',adminUserController.createCoupon)
router.get('/offer',adminUserController.offerPage)
router.post('/offer',adminMiddleWare.uploadOfferImg.single('img-file'),adminUserController.createOffer)


module.exports = router;