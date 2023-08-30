function couponDiscount(id){
    let itemSum = document.getElementById('itemSum')
    let couponTitle = document.getElementById('couponTitle')
    let couponVal = document.getElementById('couponValue')
    const couponURL = `/user/coupon-update/${id}`
    fetch(couponURL)
    .then(res=>res.json())
    .then((res)=>{
        if(res.success && !res.coupon){
            couponVal.innerText = ''
            couponTitle.innerText = ''
            itemSum.innerText = res.total
            return
        }
        if(res.success){
            let  {couponCode,couponValue,couponType} = res.coupon
            let value;
            if(couponType === 'percent' ){
                value = `${couponValue}% off`
            }else{
                value = `flat ₹${couponValue}`
            }
            couponVal.innerText = value
            couponTitle.innerText = couponCode
            itemSum.innerText = res.total
        }else{
            window.location.href = res.redirect
        }
    })
}