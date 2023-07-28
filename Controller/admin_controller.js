const AdminCollection = require('../Model/admin_details')
const UserCollection = require('../Model/user_details')
const ProductCollection = require('../Model/product')

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
    },
    userLists: async (req,res)=>{
   
        try{
            const userDatas = await UserCollection.find({})
           
            res.render('userlists',{datas:userDatas})
           
            
        }catch(e){
            console.log(e.message)
        }
        
    },
    addProductPage: (req,res)=>{
        res.render('add-product')
    },
    addProduct: async (req,res)=>{
        console.log(req.body)
        console.log(req.file)
        res.send('added')
    }
    
}