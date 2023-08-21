function deleteAddress(id, elem) {
    // if (confirm('are youe sure to delete this address')) {
        let toDelete = elem.closest('.address-box')
        let delAdressUrl = `/user/delete-address/${id}`
        let reqOption = {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json'
            }
        }
        fetch(delAdressUrl, reqOption)
            .then(res => res.json())
            .then((res) => {
                if (res.success) {
                    toDelete.style.display = 'none'
                    generateMessage('success', 'address deleted successfully')
                } 
            })
            .catch((e) => {
                generateMessage('danger', 'some error occured try again')
            })
    }
// }