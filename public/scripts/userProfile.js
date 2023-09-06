function deleteAddress(id, elem) {
     if (confirm('are youe sure to address this address ?')) {
        let toDelete = elem.closest('.address-box')
        let delAdressUrl = `/delete-address/${id}`
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
                }else{
                    window.location.herf= res.redirect
                }
            })
            .catch((e) => {
                generateMessage('danger', 'some error occured try again')
            })
        }
     }



     let userData;
     let editProfileModale = document.getElementById('editProfileModale')
     let userDetailModale = document.getElementById('userDetailModale')
     let modaleBg = document.getElementById('modaleBg')
     let emailInput = document.getElementById('email')

     //onclick function to show edit profile modale
     function editProfile() {
         fetch('/user-data')
             .then(res => res.json())
             .then((res) => {
                 if (res.success) {
                     userData = res.user
                 } else {
                     window.location.href = res.redirect
                 }
             })
         document.body.style.overflow = 'hidden'
         modaleBg.style.display = 'block'
         editProfileModale.style.display = 'flex'
     }

     //event listener to close the modale if click on the background of modale
     modaleBg.addEventListener('click', () => {
         editProfileModale.style.display = 'none'
         modaleBg.style.display = 'none'
         userDetailModale.style.display = 'none'
         document.body.style.overflow = 'unset'
     })

     function editUserData() {
         userDetailModale.style.display = 'flex'
         document.getElementById('name').value = userData.name
         document.getElementById('email').value = userData.email
     }

     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    

     
    
     //getting form data
     
     function update(){
         const formData = {}
         formData.name = document.getElementById('name').value
         formData.email = document.getElementById('email').value
         consle.log(formData)
         fetch("/data-update", {
             method: "POST",
             body: JSON.stringify(formData),
             headers : {
                 'Content-Type':'application/json'
             }
         })
             .then(response => response.json())
             .then(res => {
                 if (res.success) {
                     alert('updated')
                 }
             })
             .catch(error => {

                 console.error("Error:", error);
             });
     }