const express = require('express');
const router = express.Router();
const multer = require('multer')

const adminController = require('../Controller/admin_controller');
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

router.get('/userlist',adminController.userLists)

router.get('/add-category', adminController.addCategoryPage)
router.post('/add-category', adminController.addCategory)

router.get('/add-product',adminController.addProductPage)
router.post('/add-product',upload.single('img-file'),adminController.addProduct)

router.get('/dashboard',adminMiddleWare.isAdmin,adminController.dashboard)
router.get('/products',adminController.productsPage)


module.exports = router;