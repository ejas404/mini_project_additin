const UserCollection = require('../Model/user_details')
const AddressCollection = require('../Model/address_details')
const ProductCollection = require('../Model/product')

const titleUpperCase = require('../public/scripts/title_uppercase')
const nodemailer = require('nodemailer')

//email configuration of sender
const senderConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
   
    auth: {
      user: process.env.EMAILID,
      pass: process.env.EMAILPASSWORD
    }
  };

// random otp generator
function generateOTP() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
  }

module.exports = {
    userSignUp : async (req,res)=>{
        const {name , email, password} = req.body
         try{
            const existingUser = await UserCollection.findOne({email: email})
            if(existingUser){
                return res.render('signup',{message:'alredy have a user with this id'})
            }else{
                let userCount = await UserCollection.findOne().sort({_id:-1})
                let starter_id =100;
                if(userCount){
                    starter_id = Number(userCount.user_id)
                } 
     
                const newUser = await UserCollection.create({
                    user_id:String(starter_id+1),
                    name: name,
                    email:email,
                    password : password,
                    isBlocked : false
    
                })
                console.log(newUser)
                res.render('user-login',{message : 'user created successfully'})
            }
        }catch(e){
            console.log(e)
        }
    
    },

    userLogin: async (req,res)=>{
        const {email , password} = req.body
        try{
            const existingUser = await UserCollection.findOne({email:email})
            if(!existingUser){
                res.render('user-login',{message:'invalid user'})
            }else{
                if(existingUser.password === password && existingUser.email === email){
                    req.session.user = email;
                    res.redirect('/')
                }else{
                    res.render('user-login', {message:'incorrect user or password'})
                }
            }
        }catch(e){
            console.log(e)
        }
    },
    

    signUpPage: async (req,res)=>{
        res.render('signup')
    },
    
    loginPage:async(req,res)=>{
        res.render('user-login',{h2:'Login Now'})
    },
    profilePage: async(req,res)=>{
        try{
            
            if(req.session.user){
                const user = await UserCollection.findOne({email:req.session.user})
                const address = await AddressCollection.find({user_id : user.user_id})
                console.log(address)
                res.render('user-profile',{user,address})
            }else{
                res.send('please login')
            }

           
        }catch(e){
            console.log(e)
        }
        
    },

    //render the page for adding address of user
    addAddressPage: (req,res)=>{
        res.render('add-address')
    },
    addAddress: async (req,res)=>{
      try{
        
        const user = await UserCollection.findOne({email:req.session.user})
        console.log(user)
        const address = {
            user_id : user.user_id,
            houseName : req.body.houseName,
            streetAddress : req.body.streetAddress,
            city : req.body.city,
            state : req.body.state,
            postalcode : req.body.postalcode,
            mobile : req.body.mobile

        }

        const userAddress = await AddressCollection.create(address);
        console.log(userAddress)

        res.redirect('/user/user-profile')

      }
      catch(e){
        console.log(e)
      }
    },
    otpPage : (req,res)=>{
        res.render('user-otp')
    },
    email : (req,res)=>{
        res.render('emailenter')
    },
    emailotp : async (req,res)=>{
        try{
            const isExist = await UserCollection.findOne({email:req.body.email})
            if(isExist){
                const transporter = nodemailer.createTransport(senderConfig);
                const otp = generateOTP()
                
                req.session.otp = String(otp)
                const mailOptions = {
                    from: senderConfig.auth.user,
                    to: isExist.email,
                    subject: 'resetting password',
                    text: `your otp for resetting password is ${otp}`
                  }

                  await transporter.sendMail(mailOptions);
                 req.session.user = req.body.email
                 res.render('user-otp')
            }else{
                res.render('emailenter',{message : 'no such user with this email'})
            }
        }catch(e){
            console.log(e)
        }

       
    },
    logout : (req,res)=>{
        req.session.destroy((err)=>{
            if(err){
                console.log(err.message)
            }else{
                console.log('destroyed successfully')
            }
        })
        res.redirect('/')
    },
    singleProduct : async (req,res)=>{
        try{
            console.log('hai')
            req.session.product_id = req.params.id
            const product_id = req.params.id
            const product = await ProductCollection.findOne({ product_id })
            res.redirect('/user/' + product.productName)
        }catch(e){
            console.log(e)
        }
       

    }, 
    singleProductPage : async (req,res)=>{
        const product_id = req.session.product_id
        const product = await ProductCollection.aggregate([
            {
                $match : {
                   product_id
                }
             },
             {
                $lookup : {
                    from : 'categories',
                    localField : 'productCategory',
                    foreignField : 'category_id',
                    as : 'category'
                }
            }
           

        ])
        console.log(product)
        const productName = (titleUpperCase(product[0].productName))
        res.render('user-single-product',{product,productName})
    },
    resetPassword : async (req,res)=>{
      try{
        console.log(req.body)
        console.log(req.session.user)
        const resetPassword = await UserCollection.findOneAndUpdate({email : req.session.user},{$set:{password:req.body.password}})
        console.log(resetPassword)
        res.render('user-login',{message:'password reset successfully'})
      }
      catch(e){
        console.log(e)
        res.render('user-login',{message:'some error occured try after some time'})
        console.log('resetted')
     }
    }
   

}