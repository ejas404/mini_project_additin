const express = require('express')
const userRouter = express.Router()


const userController = require('../Controller/user_controller')
const userProductController = require('../Controller/user_product_controller')
const userOrderController = require('../Controller/user_order_controller')
const userMiddleware = require('../Middlewares/user_middle')


//user signup----------------------------------------

//userRouter.post('/otp-configure',userController.otpConfig)



userRouter.get('/login',userController.loginPage)
userRouter.post('/login',userMiddleware.isBlocked,userController.userLogin)

userRouter.get('/logout',userController.logout)

userRouter.get('/signup',userController.signUpPage)
userRouter.post('/signup',userController.userSignUp)

userRouter.post('/resetpass',userController.resetPassword)

userRouter.get('/enter-otp',userController.otpPage)
userRouter.post('/otp-configure',userMiddleware.otpConfig )
userRouter.post('/get-otp',userMiddleware.isNumber)
userRouter.get('/email',userController.email)
userRouter.post('/emailotp',userController.emailotp)


//just for testing mongo querys
userRouter.get('/test',userOrderController.test)


userRouter.delete('/delete-address/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userController.deleteAddress)
userRouter.get('/cartquantity',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.updateCartItemQty)
userRouter.get('/add-to-cart/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.addToCart)
userRouter.delete('/delete-cart-item/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.deleteCartItem)
userRouter.post('/add-to-wishlist/:id',userMiddleware.isLoggedinMid,userMiddleware.isBlockedMid,userProductController.addToWishList)
userRouter.get('/coupon-update/:id', userOrderController.couponUpdate)
userRouter.get('/user-data',userController.userData)
userRouter.post('/data-update',userController.userUpdate)

userRouter.use(userMiddleware.isLoggedin,userMiddleware.isBlocked)

userRouter.get('/user-profile',userController.profilePage)
userRouter.get('/user-profile/add-address',userController.addAddressPage)
userRouter.post('/add-address',userController.addAddress)
userRouter.get('/singleproduct/:id',userProductController.singleProduct)
userRouter.get('/cart',userProductController.cartPage)
userRouter.get('/wishlist',userProductController.wishListPage)
userRouter.get('/payment',userOrderController.selectPayment)
userRouter.get('/buynow/:id',userOrderController.buyNowPage)
userRouter.post('/buynow',userOrderController.buyNow)
userRouter.post('/placeorder',userOrderController.createOrder)
userRouter.get('/other',userController.otherPage)

//orders
userRouter.get('/order-completed',userOrderController.orderCompleted)
userRouter.get('/order-failed',userOrderController.orderFailed)
userRouter.get('/orders',userOrderController.myOrders)
userRouter.get('/cart-order',userOrderController.proceedCart)
userRouter.get('/select-address',userOrderController.selelctAddress)
userRouter.post('/cart-payment',userOrderController.cartPayment)
userRouter.get('/order/:id',userOrderController.orderDetails)




//userRouter.get('/:productName',userProductController.singleProductPage)

module.exports = userRouter