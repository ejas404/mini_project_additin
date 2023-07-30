
module.exports = {
    isAdmin : (req,res,next)=>{
        console.log('isAdmin middle ware')
        if(req.session.isAdmin){
             next()
        }else{
            res.render('admin-login')
        }

    },
    islogin : async (req,res,next)=>{
       
        if(req.session.isAdmin){
            console.log("session");
            res.redirect('/admin/dashboard');
        }
            
        else{
            console.log("no session");
            next();
        }
           
    }
}