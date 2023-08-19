const UserCollection = require("../Model/user_details")

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken);

function generateOTP() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
  }
  
 

module.exports = {
    isBlocked : async (req,res,next)=>{
      try{
        const email = req.body.email
        const check = await UserCollection.findOne({email})
        if(check.isBlocked){
            return res.render('user-login',{message:'Entry restricted contact helpline !'})
        }
        next()
      }catch(e){
        console.log(e)
        return res.render('user-login',{message  :'some error occured chek your email'})
        
      }
    },
    isNumber : async(req,res)=>{
        const numberAvailable = await UserCollection.aggregate([
            {
                $match : {
                    email: req.body.email
                }
             },
             {
                $lookup : {
                    from : 'addres',
                    localField : 'user_id',
                    foreignField : 'user_id',
                    as : 'address'
                }
            }
           

        ])
        
        if(!numberAvailable[0]?.address[0]?.mobile){
            console.log('no user')
            return res.render('user-login',{message:'no user'})
        }else{
            req.session.user = req.body.email
            const number = numberAvailable[0].address[0].mobile
            const otp = generateOTP();
            req.session.otp = String(otp)

            client.messages
                .create({
                    body: `your otp is ${otp}`,
                    to: `+91${number}`, // Text your number
                    from: '+17623006956', // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));
           
           return  res.json({
                successMsg: true,
                redirect: 'http://localhost:4400/user/enter-otp'
            })
        }
       
    },
    otpConfig : (req,res)=>{
        console.log(req.session.otp)
        console.log(req.body.otp)
       if(req.session.otp === req.body.otp){
         return  res.render('confirm-password')
       }
       res.render('user-otp',{message : 'otp doesnt match'})
    },
    isLoggedin : (req,res,next)=>{
        if(req.session.user){
            next()
        }else{
            res.redirect('/user/login')
        }
    },
    isLoggedinMid : (req,res,next)=>{
        if(req.session.user){
            next()
        }else{
          return  res.json({
                redirect : '/user/login',
                message : 'please login first'
            })
        }
    },
    isBlockedMid : async (req,res,next)=>{
        const email = req.session.user
        const check = await UserCollection.findOne({email})
        if(check.isBlocked){
            return  res.json({
                redirect : '/user/login',
                message : 'entry prohibited please contact authority'
            })
        }
        next()
    }
}