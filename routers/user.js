const express = require('express')
const router = express.Router()


const userController = require('../Controller/user_controller')


//user signup----------------------------------------

router.get('/login',userController.loginPage)
router.post('/login',userController.userLogin)


router.get('/signup',userController.signUpPage)
router.post('/signup',userController.userSignUp)

router.get('/user-profile',userController.profilePage)
router.get('/user-profile/add-address',userController.addAddressPage)
router.post('/user-profile/add-address',userController.addAddress)

module.exports = router