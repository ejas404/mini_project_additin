function addToCart(id) {
    fetch(`/user/add-to-cart/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }

    })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            if (res.successMsg) {
                location.reload()
                alert('product added to cart successfully')
            } else {
                window.location.href = res.redirect
                alert(res.message)
            }
        }).catch((e) => {
            if (e) {
                console.log(e)
            }
        })
}


function addToWishList(id,icon){
    console.log(icon)
    let wishListURL = `/user/add-to-wishlist/${id}`
    let reqOption = {
        method : 'POST',
        headers :{
            'Content-type':'application/json'
        }
    }

    fetch(wishListURL,reqOption)
    .then(res=>res.json())
    .then((res)=>{
        if(res.success){
            if(res.msg === 'added'){
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill'); 
                generateMessage('success','product added to wishlist')
            }else{
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                generateMessage('success','product removed from wishlist')
            }
        }
    })
    .catch((e)=>{
        console.log(e)
        alert('try again later')
    })
}


