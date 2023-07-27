const UserCollection = require('../Model/user_details')

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
                    res.send(`welcom ${existingUser.name}`)
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
        res.render('login',{h2:'Login Now'})
    }

}