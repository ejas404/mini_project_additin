const AdminCollection = require('../Model/admin_details')

module.exports = {
    adminLogin : async (req,res)=>{
        const {email , password } = req.body
       try{
            const admin = await AdminCollection.findOne({})
    
            if(admin.email === email && admin.password === password){
                res.render('dashboard')
            }else{
                res.send('invalid username or password')
            }
       }catch(e){
            console.log(e)
       }
       
    },
    loginPage : async(req,res)=>{
        res.render('login',{h2:'Admin Login',url:'/admin/login', isAdmin:true})
    }
}