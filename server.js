const express = require('express');
const app = express();
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = 4400



//importing admin router from routers/admin.js file
const adminRouter = require('./routers/admin')

//importing user router from routers/user.js file
const userRouter = require('./routers/user')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false 
}))

app.set('view engine','ejs')
app.set('views',['./views/user','./views/admin'])

//requests starts with /admin will be connected to adminRouter
app.use('/admin', adminRouter);
//requests starts with /user will be connected to user Router
app.use('/user',userRouter)





app.get('/',(req,res)=>{
    res.send('home')
})




mongoose.connect('mongodb://127.0.0.1:27017/additin')
.then(
    app.listen(PORT ,()=>{
        console.log('server started at 4400')
    })
).catch((e)=>{
    console.log(e)
})

