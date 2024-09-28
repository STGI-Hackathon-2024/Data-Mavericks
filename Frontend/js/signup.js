document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for signup form submission
    const signupForm = document.getElementById('signupForm');

    // If form exists, attach the submit event listener
    if (signupForm) {
        signupForm.addEventListener('submit', registerUser);
    }

    // Register User function to handle the form submission
    function registerUser(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the values from the form fields
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('cpassword').value;
        const profileImage = document.getElementById('profile_image').files[0];

        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Ensure required fields are filled
        if (!name || !email || !password || !confirmPassword || !profileImage) {
            alert('Please fill in all required fields.');
            return;
        }

        // Convert image to base64
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64Image = reader.result.split(',')[1]; // Get Base64 part

            // Prepare the form data
            const data = {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                profile_image: base64Image
            };

            // Send the data to backend using fetch
            fetch('http://127.0.0.1:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Registration successful! Please login with your new credentials.');
                    window.location.href = "login.html"; // Redirect to login page
                })
                .catch(error => {
                    alert('Registration failed. Please try again.');
                    console.error('Error:', error);
                });
        };

        // Read the image file as a base64-encoded string
        reader.readAsDataURL(profileImage);
    }
});
