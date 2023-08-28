function couponDiscount(id){
    let itemSum = document.getElementById('itemSum')
    let couponTitle = document.getElementById('couponTitle')
    let couponValue = document.getElementById('couponValue')
    const couponURL = `/user/coupon-update/${id}`
    fetch(couponURL)
    .then(res=>res.json())
    .then((res)=>{
        if(res.success){
            itemSum.innerText = res.total
            couponTitle.innerText = res.couponCode
            let value;
            if(res.couponType === 'percent' ){
                value = `${res.couponValue}% off`
            }else{
                value = `flat ${res.couponValue}`
            }
            couponValue.innerText = value
        }else{
            window.location.href = res.redirect
        }
    })
}