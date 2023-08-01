const express = require('express');
const router = express.Router();
const multer = require('multer')

const adminController = require('../Controller/admin_controller');
const adminProductController = require('../Controller/admin_product_controller')
const adminUserController = require('../Controller/admin_user_controller')
const adminMiddleWare = require('../Middlewares/admin_midlle')


router.use(express.json())
router.use(express.urlencoded({extended:true}))

//multer for storing image files
const storage = multer.diskStorage({
    destination: function (req,file,cb){
       return  cb(null,'./public/assets')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }

})

const upload = multer({storage:storage})

router.get('/login',adminController.loginPage )

router.post('/login',adminController.adminLogin)

router.get('/userlist',adminUserController.userLists)
router.get('/user/more/:id',adminUserController.userMoreDetails)
router.get('/user/block/:id',adminUserController.blockUser)
router.get('/user/unblock/:id',adminUserController.unBlockUser)

router.get('/add-category', adminController.addCategoryPage)
router.post('/add-category', adminController.addCategory)

router.get('/add-product',adminController.addProductPage)
router.post('/add-product',upload.single('img-file'),adminController.addProduct)

router.get('/products/delete/:id',adminProductController.productDeletePage)
router.get('/products/delete',adminProductController.productDelete)

router.get('/products/unblock/:id',adminProductController.productUnblock)
router.get('/products/block/:id',adminProductController.productBlock)

router.get('/dashboard',adminMiddleWare.isAdmin,adminController.dashboard)
router.get('/products',adminController.productsPage)
router.get('/products/:id', adminController.filterProducts)

router.get('/products/edit/:id',adminProductController.productEditPage)
router.post('/products/edit/:id',upload.single('img-file'), adminProductController.productEdit)




module.exports = router;