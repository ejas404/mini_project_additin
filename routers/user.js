const express = require('express')
const router = express.Router()

const userController = require('../Controller/user_controller')


//user signup----------------------------------------

router.get('/login',userController.loginPage)
router.post('/login',userController.userLogin)


router.get('/signup',userController.signUpPage)

router.post('/signup',userController.userSignUp)

module.exports = router