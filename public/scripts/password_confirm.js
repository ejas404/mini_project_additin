const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessages = document.querySelectorAll('.error');

    // Custom validation for Confirm Password
    confirmPasswordInput.addEventListener('input', () => {
        if (passwordInput.validity.valid) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity("Passwords do not match.");
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        }
    });

    // Show Password functionality
    const showPasswordCheckbox = document.getElementById('showPassword');
    showPasswordCheckbox.addEventListener('change', () => {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = 'text';
            confirmPasswordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
            confirmPasswordInput.type = 'password';
        }
    });

    // Prevent default form submission and display errors
    document.getElementById('passwordForm').addEventListener('submit', (event) => {
        console.log(passwordInput.validity.valid)
        console.log('hai')
        if (!passwordInput.validity.valid || !confirmPasswordInput.validity.valid) {
            event.preventDefault();
            errorMessages.forEach(error => {
                error.style.display = 'block'; // Hide all error messages
            });

            if (!passwordInput.validity.valid) {
                errorMessages[0].style.display = 'block'; // Show the password error message
            }

            if (!confirmPasswordInput.validity.valid) {
                errorMessages[1].style.display = 'block'; // Show the confirm password error message
            }
        }
    });