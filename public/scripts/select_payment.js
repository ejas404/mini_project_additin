let couponId ;
function couponDiscount(id) {
    let itemSum = document.getElementById('itemSum')
    let couponTitle = document.getElementById('couponTitle')
    let couponVal = document.getElementById('couponValue')
    const couponURL = `/coupon-update/${id}`
    fetch(couponURL)
        .then(res => res.json())
        .then((res) => {
            if (res.success && !res.coupon) {
                couponVal.innerText = ''
                couponTitle.innerText = ''
                itemSum.innerText = res.total
            } else if (res.success) {
                let { couponCode, couponValue, couponType } = res.coupon
                let value;
                if (couponType === 'percent') {
                    value = `${couponValue}% off`
                } else {
                    value = `flat ₹${couponValue}`
                }
                couponId = id
                couponVal.innerText = value
                couponTitle.innerText = couponCode
                itemSum.innerText = res.total
            } else if (res.except) {
                couponTitle.innerText = ''
                couponVal.innerText = res.msg
                itemSum.innerText = res.total
            } else {
                window.location.href = res.redirect
            }
        })
}


function changeButton() {
    const button = document.getElementById('formSubmitBtn')
    if (button.type === 'submit') {
        button.type = 'button'
        button.setAttribute('onclick', 'checkoutPayment()')
    } else {
        button.type = 'submit'
        button.removeAttribute('onclick')
    }
}

function checkoutPayment(){
    const reqUrl = '/placeorder'
    const reqBody = {
        paymentMethod : 'UPI/Bank',
    }
    if(couponId){
        reqBody.discountCoupon = couponId
    }

    fetch(reqUrl,{
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(reqBody)
    })
    .then(res => res.json())
    .then((res)=>{
        if(res.success){
            payment(res.orderInstance)
        }
    })
}

function payment(orderDetails){

    var options = {
        key: 'rzp_test_GJNZbRGoHhpUNK',  
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        order_id: orderDetails.id,
        name: 'Acme Corp',
        description: 'Payment for order #12345',
        handler: function (response){
            console.log('this is b4 response')
            console.log(response)
          verifyPayment(response,orderDetails)
        }
      };
    
      var rzp1 = new Razorpay(options);
      rzp1.open();  
}