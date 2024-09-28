document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookiesArray = document.cookie.split(';');
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i].trim();
            if (cookie.indexOf(nameEQ) == 0) return cookie.substring(nameEQ.length, cookie.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + "=; Max-Age=-99999999;";
    }

    const isLoggedIn = getCookie('isLoggedIn');

    if (isLoggedIn) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" id="logoutLink">Logout</a></li>
        `;

        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            deleteCookie('isLoggedIn');
            window.location.href = 'index.html';
        });
    } else {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="signup.html">Sign Up</a></li>
            <li><a href="login.html">Login</a></li>
        `;
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const cpassword = document.getElementById('cpassword').value;
            const profile_image = document.getElementById('profile_image').files[0];

            if (password !== cpassword) {
                alert('Passwords do not match!');
                return;
            }

            // Convert the image file to a Base64 string
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1]; // Get Base64 part of the string

                const data = {
                    name: name,
                    email: email,
                    password: password,
                    cpassword: cpassword,
                    profile_image: base64Image // Use the Base64 string here
                };

                try {
                    const response = await fetch('http://127.0.0.1:5000/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', // Set the content type to JSON
                        },
                        body: JSON.stringify(data), // Convert the object to a JSON string
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Signup successful!');
                        setCookie('isLoggedIn', true, 1);
                        window.location.href = 'login.html';
                    } else {
                        alert(`Error: ${result.message || 'Signup failed!'}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                }
            };

            // Read the file as Data URL (Base64)
            reader.readAsDataURL(profile_image);
        });
    }
});
