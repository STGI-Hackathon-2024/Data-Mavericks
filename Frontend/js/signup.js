// Ensure any existing event listeners are removed before adding the new one
const signupForm = document.getElementById("signupForm");
signupForm.removeEventListener("submit", handleSignup);
signupForm.addEventListener("submit", handleSignup);

function handleSignup(event) {
  event.preventDefault(); // Prevent default form submission behavior
  
  // Disable the submit button immediately to prevent multiple submissions
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.innerText = "Signing up...";
  
  // Collect form data
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("cpassword").value;
  const profileImageInput = document.getElementById("profile_image");
  
  // Basic form validation
  if (!name || !email || !password || !confirmPassword) {
    showError("Please fill in all fields.");
    return;
  }
  
  // Ensure password and confirmPassword match
  if (password !== confirmPassword) {
    showError("Passwords do not match!");
    return;
  }
  
  // Ensure the image file is selected
  if (!profileImageInput.files.length) {
    showError("Please upload a profile image.");
    return;
  }
  
  const profileImage = profileImageInput.files[0];
  
  // Use FileReader to encode the image
  const reader = new FileReader();
  
  reader.onload = function () {
    const base64Image = reader.result; // Base64 string of the uploaded image
    const signupData = {
      fullName: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      profileImage: base64Image,
    };
    
    // Send the data to the backend API
    fetch('http://127.0.0.1:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert("Signup successful! Redirecting to login...");
        window.location.href = "login.html";
      } else {
        showError(data.message || "An error occurred during signup.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      showError("Success, Click Ok.");
    });
  };
  
  reader.onerror = function (error) {
    console.error("Error reading image:", error);
    showError("Failed to read the image file.");
  };
  
  // Start reading the image file
  reader.readAsDataURL(profileImage);
}

function showError(message) {
  alert(message);
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = false;
  submitButton.innerText = "Sign Up";
}