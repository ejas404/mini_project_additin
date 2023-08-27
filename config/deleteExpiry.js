const CouponCollection = require('../Model/coupon')

async function delelteCoupons(){
    let currentTime = Date.now()
    try{
        
        const deletedCoupons = await CouponCollection.deleteMany({expiryDate : {$lt : currentTime}})
        console.log(deletedCoupons)

    }catch(e){
        console.log(e)
    }
}

module.exports = function checkForExpiry(){
    setInterval(delelteCoupons,1000*5)
}