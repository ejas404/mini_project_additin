function addToCart(id,elem) {
    console.log('hai')
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
                let newElement = document.createElement('a')
                newElement.className = 'default-button px-2s'
                newElement.textContent = 'Go to Cart->'
                newElement.href = '/user/cart'
                
                elem.removeAttribute('onclick')
                elem.replaceChild(newElement , elem.firstChild)
                generateMessage('success','added to cart successfully')
            } else {
                location.reload()
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
        }else{
            window.location.href = res.redirect
        }
    })
    .catch((e)=>{
        console.log(e)
        alert('try again later')
    })
}


