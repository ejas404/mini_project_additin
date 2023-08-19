
let itemSum = document.getElementById('itemSum')
let shippingCharge = document.getElementById('shippingCharge')
let totalSum = document.getElementById('totalSum')



function deleteItem(elem,id){
    let cartItem = elem.closest('.cart-item')
  
    const delUrl = `/user/delete-cart-item/${id}`
    const requestOption = {
      method : 'DELETE',
      headers : {
          'Content-type':'application/json'
      }
    } 

    fetch(delUrl,requestOption)
    .then(res=>res.json())
    .then((res)=>{
      if(res.success){
          let total = res.total
          cartItem.style.display = 'none'
          itemSum.innerText = total
          if(total > 5000){
            shippingCharge.innerText = 'free shipping'
            totalSum.innerText = total
          }else{
            shippingCharge.innerText = 40
            totalSum.innerText = total+40
          }
          resetPlaceOrder()
          generateMessage('success','item removed successfully')
          
      }else{
          alert(res.message);
      }
    })
    .catch((e)=>{
      console.log(e)
    })

  }