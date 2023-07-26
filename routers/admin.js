const express = require('express');
const router = express.Router();

const {AdminCollection} = require('../dbs_collections/collections')
router.get('/login', async (req,res)=>{
    const {name , email, password } = req.body
   try{
        const admin = await AdminCollection.findOne({})

        if(admin.name === name && admin.password === password){
            res.send('welcome  admin')
        }else{
            res.send('invalid username or password')
        }
   }catch(e){
        console.log(e)
   }
   
})

router.get('/add',async (req,res)=>{
   
    res.send('some admin')
})






module.exports = router;