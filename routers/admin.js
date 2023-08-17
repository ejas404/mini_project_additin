const express = require('express');
const router = express.Router();


const adminController = require('../Controller/admin_controller');
const adminProductController = require('../Controller/admin_product_controller')
const adminUserController = require('../Controller/admin_user_controller')
const adminHomepageController = require('../Controller/admin_homepagecontroller')
const adminMiddleWare = require('../Middlewares/admin_midlle')


router.use(express.json())
router.use(express.urlencoded({extended:true}))



router.get('/login',adminController.loginPage )
router.post('/login',adminController.adminLogin)

router.get('/logout',adminController.logout)

router.get('/userlists',adminMiddleWare.isAdmin,adminUserController.userLists)
router.get('/user/more/:id',adminMiddleWare.isAdmin,adminUserController.userMoreDetails)
router.get('/user/block/:id',adminMiddleWare.isAdmin,adminUserController.blockUser)
router.get('/user/unblock/:id',adminMiddleWare.isAdmin,adminUserController.unBlockUser)

router.get('/add-category',adminMiddleWare.isAdmin, adminProductController.addCategoryPage)
router.post('/add-category',adminMiddleWare.isAdmin, adminProductController.addCategory)

router.get('/add-product',adminMiddleWare.isAdmin,adminProductController.addProductPage)
router.post('/add-product',adminMiddleWare.uploadProductImg.array('img-file',{maxCount : 3}),adminProductController.addProduct)

router.get('/others',adminProductController.othersPage)
router.post('/edit-banner',adminMiddleWare.bannerUpload.array('banner-img',{maxCount : 3}),adminHomepageController.editBanner)
router.get('/edit-banner/:path',adminHomepageController.editBannerPage)

// router.get('/products/delete/:id',adminProductController.productDeletePage)
// router.get('/products/delete',adminProductController.productDelete)

router.get('/products/unblock/:id',adminMiddleWare.isAdmin,adminProductController.productUnblock)
router.get('/products/block/:id',adminMiddleWare.isAdmin,adminProductController.productBlock)

router.get('/dashboard',adminMiddleWare.isAdmin,adminMiddleWare.isAdmin,adminController.dashboard)
router.get('/products',adminMiddleWare.isAdmin,adminProductController.productsPage)
router.get('/products/:id',adminMiddleWare.isAdmin, adminProductController.filterProducts)

router.get('/products/edit/:id',adminMiddleWare.isAdmin,adminProductController.productEditPage)
router.post('/products/edit/:id',adminMiddleWare.isAdmin,adminMiddleWare.uploadProductImg.single('img-file'), adminProductController.productEdit)

router.get('/product-details/:id',adminMiddleWare.isAdmin,adminProductController.singleProduct)
router.get('/product/:productname',adminMiddleWare.isAdmin, adminProductController.singleProductPage)


module.exports = router;