
let paginationRow = document.getElementById('pagination-row');

function renderProducts(products,num,cart,wishlist){
    paginationRow.setAttribute('data-page-num',num)

    if(!products || products.length === 0 ){
        paginationRow.innerHTML = `<div class="empty-message text-center">
        <h1>Sorry No Products Please Check after some time</h1>
        </div>`

        return
    }
    paginationRow.innerHTML = ``

    for (let each of products) {
        const productHtml = `
            <div class="col-lg-4 col-md-6 pt-md-0 pt-3 text-center position-relative">
                <a style="text-decoration: none;" class="" href="/singleproduct/${each.product_id}">
                    <div style="height: 350px;" class="card d-flex flex-column align-items-center ">
                        <div class="card-img">
                            <img src="${each.productImg[0]}" alt="" height="100" id="shirt">
                        </div>
                        <div class="product-name">
                            ${each.productName}
                        </div>
                        <div class="card-body pt-0">
                            <div class="d-flex align-items-center price">
                                <div class="del mr-2"><span class="text-dark" style="font-size: 15px;">Rs.${Number(each.productPrice) + 1000}</span></div>
                                <div class="font-weight-bold" style="font-weight: bold; margin-left: 5px;">Rs.${each.productPrice}</div>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="productButtons position-absolute d-flex justify-content-between" style="width: 22.5rem;top: 88%; padding: 0 10px;">
                    ${cart && cart.includes(each.product_id)
                        ? `<a class="default-button px-2 rounded d-block" href="/user/cart">Go to Cart -></a>`
                        : `<div class="pb-1 add-to-cart-btn" onclick="addToCart('${each.product_id}', this)"><i class="fa-solid fa-cart-plus" style="font-size: 25px;"></i></div>`
                    }
                    <a class="buy-now-btn d-block rounded" style="text-decoration: none;" href="">Buy Now -></a>
                </div>
                <div class="wishlist position-absolute top-0 ms-1">
                    <i onclick="addToWishList('${each.product_id}', this)" id="biHrt" class="bi bi-heart${wishlist && wishlist.includes(each.product_id) ? '-fill' : ''} wishlist-icon"></i>
                </div>
            </div>
        `;
        
        paginationRow.innerHTML += productHtml;
    }
}  

function paginate(num,elem){
    let paginationURL = `/paginate/${num}`
    let reqOption = {
        method : 'GET',
        headers : {
            'Content-type':'application/json'
        }
    }

    fetch(paginationURL,reqOption)
    .then(res=>res.json())
    .then((res)=>{
        if(res.success){
            if(res.isUser){
                renderProducts(res.products,num,res.cart,res.wishlist)
            }else{
                renderProducts(res.products,num)
            }
        }

    })
    .catch((e)=> console.log(e))
}

function paginatePrev(){
    let pageNum = paginationRow.getAttribute('data-page-num')
    if(pageNum === 0) return
    if(pageNum > 0){
      paginate(pageNum-1);
    }

}

function paginateNext(){
    let pageNum = paginationRow.getAttribute('data-page-num')
    let pageButtons = document.querySelectorAll('.paginate-buttons')
    if(pageNum >= pageButtons.length-1)return
    if(pageNum < pageButtons.length-1){
         paginate(Number(pageNum)+1)
    }
}