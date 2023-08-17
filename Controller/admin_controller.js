const AdminCollection = require('../Model/admin_details')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    adminLogin: async (req, res) => {
        const { email, password } = req.body
        try {
            const admin = await AdminCollection.findOne({})

            if (admin.email === email && admin.password === password) {
                req.session.isAdmin = 'hai admin'
                console.log('after')
                res.redirect('/admin/dashboard')
            } else {
                res.render('admin-login', { message: 'invalid user name or password' ,isAdmin : true})
            }
        } catch (e) {
            console.log(e)
        }

    },

    // renders login page
    loginPage: async (req, res) => {
        res.render('admin-login', {isAdmin : true})
    },

    dashboard: (req, res) => {
    res.render('dashboard',{isAdmin : true})
    },
    logout : (req,res)=>{
        req.session.destroy((err)=>{
            if(err){
                console.log('error occured during destroying session')
            }else{
                console.log('session destroyed')
            }
        })
        res.redirect('/admin/login')
    }
  
    

}