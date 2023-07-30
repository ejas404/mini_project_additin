const UserCollection = require('../Model/user_details')
const AddressCollection = require('../Model/addres_details')

module.exports = {
    userSignUp : async (req,res)=>{
        const {name , email, password,password2} = req.body
        console.log(req.query)
        if(password2 !== password){
            return res.send('confirmed password is not same as first')
        }
        try{
            const existingUser = await UserCollection.findOne({email: email})
            if(existingUser){
                return res.send('user already existing')
            }else{
                let userCount = await UserCollection.findOne().sort({_id:-1})
                let starter_id =100;
                if(userCount){
                    starter_id = userCount.user_id
                } 
     
                const newUser = await UserCollection.create({
                    user_id: starter_id+1,
                    name: name,
                    email:email,
                    password : password,
                    isBlock : false
    
                })
                console.log(newUser)
                res.send('user created successfully')
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
                res.render('login',{message:'invalid user'})
            }else{
                if(existingUser.password === password && existingUser.email === email){
                    req.session.user = email;
                    res.redirect('/user/user-profile')
                }else{
                    res.render('login', {message:'incorrect user or password'})
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
    }

}