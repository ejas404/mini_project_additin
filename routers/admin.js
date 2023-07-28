const express = require('express');
const router = express.Router();
const multer = require('multer')

const adminController = require('../Controller/admin_controller');
const upload = multer({ dest: 'uploads/' })
router.use(express.json())
router.use(express.urlencoded({extended:true}))
// const storage = multer.diskStorage({
//     destination: function (req,file,cb){
//         cb(null,'./public/assets')
//     },

// })

router.get('/login',adminController.loginPage )

router.post('/login',adminController.adminLogin)

router.get('/userlist',adminController.userLists)

router.get('/add-product',adminController.addProductPage)
router.post('/add-product',upload.single('img-file'),adminController.addProduct)



module.exports = router;