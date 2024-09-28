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
            const profileImage = document.getElementById('profile_image').files[0];

            if (password !== cpassword) {
                alert('Passwords do not match!');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('cpassword', cpassword);
            formData.append('profile_image', profileImage);

            try {
                const response = await fetch('http://192.168.120.120:5000/api/signup', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Signup successful!');
            
                    setCookie('isLoggedIn', true, 1); 
                    window.location.href = 'login.html'; 
                } else {
                    alert(`Error: ${result.error || 'Signup failed!'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});
