const express = require('express')
const router = express.Router()

const {userCollection} = require('../dbs_collections/collections')

router.get('/signup',async (req,res)=>{
    const {name , email, password,password2} = req.query
    console.log(req.query)
    if(password2 !== password){
        return res.send('confirmed password is not same as first')
    }
    try{
        const existingUser = await userCollection.findOne({email: email})
        if(existingUser){
            return res.send('user already existing')
        }else{
            let userCount = await userCollection.findOne().sort({_id:-1})
            let user_id =100;
            if(userCount){
                user_id = userCount.user_id
            } 
 
            const newUser = await userCollection.create({
                user_id: user_id+1,
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

})

module.exports = router