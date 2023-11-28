//filter form

const filterForm = document.getElementById('productFilterForm')
filterForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const reqQuery = new URLSearchParams(new FormData(filterForm)).toString()
    console.log(reqQuery)
    fetch(`/products/filter?${reqQuery}`)
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                sortedProducts(res.products, res.cartAndWish)
            }
        })

})

const sortBy = document.getElementById('sortBy')
sortBy.addEventListener('change', (e) => {
    document.getElementById('filterSubmitButton').click()
})



function sortedProducts(products, cartAndWish) {
    const productRow = document.getElementById('productsRow')

    let rowProducts = ""

    for (let each of products) {
        let itemCol = `   <div class="col-lg-4 col-md-6">
        <div class="wrapper position-relative">
            <div class="wishlist-heart-group">
                <input name="${each.product_id}" id="${each.product_id}" type="checkbox" ${cartAndWish && cartAndWish[0]?.wishListIds?.includes(each.product_id) ? 'checked' : ''
        }/>
                <label for="${each.product_id}" data-hover-text="${each.product_id}">
                    <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                        xmlns:cc="http://creativecommons.org/ns#"
                        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                        xmlns:svg="http://www.w3.org/2000/svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                        version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
                        <g transform="translate(0,-952.36218)">
                            <path style="color:#000000;enable-background:accumulate;"
                                d="m 34.166665,972.36218 c -11.41955,0 -19.16666,8.91891 -19.16666,20.27029 0,19.45943 15,27.56753 35,39.72973 20.00001,-12.1622 34.99999,-20.2703 34.99999,-39.72973 0,-11.35137 -7.7471,-20.27029 -19.16665,-20.27029 -7.35014,0 -13.39148,4.05405 -15.83334,6.48647 -2.44185,-2.43241 -8.48319,-6.48647 -15.83334,-6.48647 z"
                                fill="transparent" id="heart-path" stroke="#ffff"
                                stroke-width="5" marker="none" visibility="visible"
                                display="inline" overflow="visible" />
                        </g>
                    </svg>
                </label>
            </div>
            <div class="container m-0 p-0">
                <div class="top">
                    <img class="my-auto" src="${each.productImg[0]}" alt="">
                </div>
                <div class="bottom ${cartAndWish && cartAndWish[0]?.cartIds && cartAndWish[0]?.cartIds.includes(each.product_id) ? 'clicked' : ''
        }">
                    <div class="left">
                        <div class="details">
                            <h6>${each.productName}</h6>
                            <p class="ind-rs">${each.productPrice}</p>
                        </div>
                        <div class="buy" onclick="addToCart('${each.product_id}',this,'card')">
                            <i class="material-icons" style="color: #fff;">add_shopping_cart</i>
                        </div>
                    </div>
                    <div class="right">
                        <div class="done"><a href="/cart"><i class="material-icons">shopping_cart_checkout</i></a></div>
                        <div class="details">
                            <h1></h1>
                            <p class="mt-3"><strong>Go to cart</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`

        rowProducts += itemCol
    }

    productRow.innerHTML = rowProducts
}





// For Filters
document.addEventListener("DOMContentLoaded", function () {
    // For Applying Filters
    $('#inner-box').collapse(false);
    $('#inner-box2').collapse(false);




    // Showing tooltip for AVAILABLE COLORS
    $(function () {
        $('[data-tooltip="tooltip"]').tooltip()
    })

    // For Range Sliders
    var inputLeft = document.getElementById("input-left");
    var inputRight = document.getElementById("input-right");

    var thumbLeft = document.querySelector(".slider > .thumb.left");
    var thumbRight = document.querySelector(".slider > .thumb.right");
    var range = document.querySelector(".slider > .range");

    var amountLeft = document.getElementById('amount-left')
    var amountRight = document.getElementById('amount-right')

    function setLeftValue() {
        var _this = inputLeft,
            min = parseInt(_this.min),
            max = parseInt(_this.max);

        _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

        var percent = ((_this.value - min) / (max - min)) * 100;

        thumbLeft.style.left = percent + "%";
        range.style.left = percent + "%";
        amountLeft.innerText = parseInt(percent * 100);
    }
    setLeftValue();

    function setRightValue() {
        var _this = inputRight,
            min = parseInt(_this.min),
            max = parseInt(_this.max);

        _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

        var percent = ((_this.value - min) / (max - min)) * 100;

        amountRight.innerText = parseInt(percent * 100);
        thumbRight.style.right = (100 - percent) + "%";
        range.style.right = (100 - percent) + "%";
    }
    setRightValue();

    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);

    inputLeft.addEventListener("mouseover", function () {
        thumbLeft.classList.add("hover");
    });
    inputLeft.addEventListener("mouseout", function () {
        thumbLeft.classList.remove("hover");
    });
    inputLeft.addEventListener("mousedown", function () {
        thumbLeft.classList.add("active");
    });
    inputLeft.addEventListener("mouseup", function () {
        thumbLeft.classList.remove("active");
    });

    inputRight.addEventListener("mouseover", function () {
        thumbRight.classList.add("hover");
    });
    inputRight.addEventListener("mouseout", function () {
        thumbRight.classList.remove("hover");
    });
    inputRight.addEventListener("mousedown", function () {
        thumbRight.classList.add("active");
    });
    inputRight.addEventListener("mouseup", function () {
        thumbRight.classList.remove("active");
    });
});