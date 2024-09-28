document.addEventListener('DOMContentLoaded', () => {


    const navLinks = document.getElementById('navLinks');

    // Utility function to set a cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Utility function to get a cookie by name
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookiesArray = document.cookie.split(';');
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i].trim();
            if (cookie.indexOf(nameEQ) == 0) return cookie.substring(nameEQ.length, cookie.length);
        }
        return null;
    }

    // Utility function to delete a cookie
    // Utility function to delete a cookie
    function deleteCookie(name) {
        document.cookie = name + "=; Max-Age=-99999999; path=/"; // Include path for deletion
    }


    // Check if the user is logged in (stored in a cookie)
    const isLoggedIn = getCookie('isLoggedIn');

    // If the user is logged in, show Home, Dashboard, and Logout
    if (isLoggedIn) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" id="logoutLink">Logout</a></li>
        `;

        // Add logout functionality
        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            deleteCookie('isLoggedIn'); // Clear login status cookie
            window.location.href = 'index.html'; // Redirect to home page
        });
    } else {
        // If not logged in, show Home, Sign Up, and Login
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="signup.html">Sign Up</a></li>
            <li><a href="login.html">Login</a></li>
        `;
    }

    // Handle form submission for login (frontend-only simulation)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate successful login
            setCookie('isLoggedIn', true, 1); // Set cookie for 1 day
            alert('Login successful!');
            localStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        });
    }


    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});
