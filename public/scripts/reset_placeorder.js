let itemCount = document.getElementById('itemsCount')
let cartItemsDetails = document.getElementById('cartItemDetails');

function resetPlaceOrder() {
    let cartItems = cartItemsDetails.querySelectorAll('.cart-item');
    let blockedItem = cartItemsDetails.querySelectorAll('.blocked-product')
    count = blockedItem ? Math.abs(blockedItem.length - cartItems.length) : cartItems.length;
    itemCount.innerText = `items(${count})`
}

resetPlaceOrder()
