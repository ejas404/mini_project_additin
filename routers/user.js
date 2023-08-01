const express = require('express')
const router = express.Router()


const userController = require('../Controller/user_controller')
const userMiddleware = require('../Middlewares/user_middle')


//user signup----------------------------------------

router.post('/otp-configure',userController.otpConfig)

router.get('/login',userController.loginPage)
router.post('/login',userMiddleware.isBlocked,userController.userLogin)


router.get('/signup',userController.signUpPage)
router.post('/signup',userController.userSignUp)


router.get('/user-profile',userController.profilePage)
router.get('/user-profile/add-address',userController.addAddressPage)
router.post('/user-profile/add-address',userController.addAddress)

router.get('/enter-otp',userController.otpPage)
router.post('/get-otp',userMiddleware.isNumber)


module.exports = router