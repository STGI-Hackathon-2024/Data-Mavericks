/* js/scripts.js */
document.addEventListener('DOMContentLoaded', async () => {
  /* Signup Form Handling */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('cpassword').value;
      const profileImage = document.getElementById('profile_image').files[0];

      if (!name || !email || !password || !confirmPassword || !profileImage) {
        alert('Please fill in all required fields.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async function () {
        const base64Image = reader.result.split(',')[1];

        const data = {
          name: name,
          email: email,
          password: password,
          cpassword: confirmPassword,
          profile_image: base64Image
        };

        try {
          document.body.style.cursor = 'wait';
          const response = await fetch('http://127.0.0.1:5000/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.status === 'success') {
            alert('Registration successful! Please login with your new credentials.');
            window.location.href = "login.html";
          } else {
            alert(result.message || 'Registration failed. Please try again.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Registration failed. Please try again.');
        } finally {
          document.body.style.cursor = 'default';
        }
      };

      reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading the profile image. Please try again.');
      };

      reader.readAsDataURL(profileImage);
    });
  }

  /* Login Form Validation */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');

      if (email && !validateEmail(email.value)) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }

      if (!password || password.value.trim() === '') {
        e.preventDefault();
        alert('Please enter your password.');
        return;
      }

      // Optional: Add authentication logic or AJAX form submission here
    });
  }

  /* Email Validation Function */
  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
});