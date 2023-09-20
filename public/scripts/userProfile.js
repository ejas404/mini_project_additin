function deleteAddress(id, elem) {
    if (confirm('are youe sure to address this address ?')) {
        let toDelete = elem.closest('.address-box')
        let delAdressUrl = `/delete-address/${id}`
        let reqOption = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }
        fetch(delAdressUrl, reqOption)
            .then(res => res.json())
            .then((res) => {
                if (res.success) {
                    toDelete.style.display = 'none'
                    generateMessage('success', 'address deleted successfully')
                } else {
                    window.location.herf = res.redirect
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
}

const myForm = document.getElementById('editProfileForm');

// Event listener for form submission
myForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(myForm);

    console.log('hai')
    const formValues = {};

    // Iterate through form data and store it in the object
    formData.forEach((value, key) => {
        formValues[key] = value;
    });



    try {
        const response = await fetch('/edit-profile', {
            method: 'POST',
            headers : {
                'Content-type':'application/json'
            },
            body: JSON.stringify(formValues),
        });

        if (response.ok) {
            const data = await response.json();
            // Do something with the data here
            console.log(data);
        } else {
            console.error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//event listener to close the modale if click on the background of modale

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;





//getting form data

function update() {
    const formData = {}
    formData.name = document.getElementById('name').value
    formData.email = document.getElementById('email').value
    consle.log(formData)
    fetch("/data-update", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
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