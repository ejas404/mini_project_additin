const express = require('express')
const userRouter = express.Router()


const userController = require('../Controller/user_controller')
const userProductController = require('../Controller/user_product_controller')
const userMiddleware = require('../Middlewares/user_middle')


//user signup----------------------------------------

//userRouter.post('/otp-configure',userController.otpConfig)

userRouter.get('/login',userController.loginPage)
userRouter.post('/login',userMiddleware.isBlocked,userController.userLogin)

userRouter.get('/logout',userController.logout)

userRouter.get('/signup',userController.signUpPage)
userRouter.post('/signup',userController.userSignUp)

userRouter.post('/resetpass',userController.resetPassword)


userRouter.get('/user-profile',userMiddleware.isLoggedin,userMiddleware.isBlockedMid,userController.profilePage)
userRouter.get('/user-profile/add-address',userMiddleware.isLoggedin,userMiddleware.isBlockedMid,userController.addAddressPage)
userRouter.post('/user-profile/add-address',userMiddleware.isLoggedin,userMiddleware.isBlockedMid,userController.addAddress)


userRouter.get('/enter-otp',userController.otpPage)
userRouter.post('/otp-configure',userMiddleware.otpConfig )
userRouter.post('/get-otp',userMiddleware.isNumber)
userRouter.get('/email',userController.email)
userRouter.post('/emailotp',userController.emailotp)

userRouter.get('/add-to-cart/:id',userProductController.addToCart)

userRouter.get('/singleproduct/:id',userMiddleware.isLoggedin,userMiddleware.isBlockedMid,userController.singleProduct)
//userRouter.get('/:productName',userMiddleware.isLoggedin,userMiddleware.isBlockedMid,userController.singleProductPage)

module.exports = userRouter