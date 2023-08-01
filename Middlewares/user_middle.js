const UserCollection = require("../Model/user_details")

// const accountSid = 'AC8944ff1f5c8e2bc370d467d38647a131'
// const authToken = 'f11f1906a66e2e7efe7732d0aa7fb186'

// const client = require('twilio')(accountSid, authToken);

function generateOTP() {
    // Generate a random 6-digit number between 100000 and 999999
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
  }
  
 

module.exports = {
    isBlocked : async (req,res)=>{
        const email = req.body.email
        const check = await UserCollection.findOne({email})
        if(check.isBlocked){
            return res.render('user-login',{message:'Entry restricted contact helpline !'})
        }
        next()
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
        
        if(numberAvailable[0].address[0].mobile){
            req.session.user = req.body.email
            const number = numberAvailable[0].address[0].mobile
            const otp = generateOTP();
            req.session.otp = String(otp)

            // client.messages
            //     .create({
            //         body: `your otp is ${otp}`,
            //         to: `+91${number}`, // Text your number
            //         from: '+17623006956', // From a valid Twilio number
            //     })
            //     .then((message) => console.log(message.sid));
           
           return  res.json({
                successMsg: true,
                redirect: 'http://localhost:4400/user/enter-otp'
            })
        }else{
            res.render('user-login',{message : 'no user'})
        }
       
    },
    otpConfig : (req,res)=>{
       if(req.session.otp === req.body.otp){
         return  res.redirect('/user/user-profile')
       }
       res.render('user-otp',{message : 'otp doesnt match'})
    }
}