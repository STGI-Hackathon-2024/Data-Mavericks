/* js/scripts.js */

document.addEventListener('DOMContentLoaded', () => {
    /* Signup Form Validation */
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
  
        if (password !== confirmPassword) {
          e.preventDefault();
          alert('Passwords do not match!');
          return;
        }
  
        // Optional: Add more validations or AJAX form submission here
      });
    }
  
    /* Login Form Validation */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
  
        if (!validateEmail(email)) {
          e.preventDefault();
          alert('Please enter a valid email address.');
          return;
        }
  
        // Optional: Add authentication logic or AJAX form submission here
      });
    }
  
    /* Live Image Capture */
    const liveVideo = document.getElementById('liveVideo');
    const captureButton = document.getElementById('captureButton');
    const capturedCanvas = document.getElementById('capturedCanvas');
  
    if (liveVideo && captureButton && capturedCanvas) {
      // Access the device camera and stream to video element
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          liveVideo.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing camera: ", err);
          alert("Unable to access the camera. Please allow camera permissions.");
        });
  
      captureButton.addEventListener('click', () => {
        const context = capturedCanvas.getContext('2d');
        capturedCanvas.width = liveVideo.videoWidth;
        capturedCanvas.height = liveVideo.videoHeight;
        context.drawImage(liveVideo, 0, 0, capturedCanvas.width, capturedCanvas.height);
        capturedCanvas.style.display = 'block';
        // Stop the video stream after capture
        liveVideo.srcObject.getTracks().forEach(track => track.stop());
        liveVideo.style.display = 'none';
        captureButton.style.display = 'none';
        alert('Live image captured successfully!');
        // Further processing can be done here (e.g., sending the image to the server)
      });
    }
  
    /* Image Upload Handling */
    const uploadForm = document.getElementById('uploadForm');
    const verificationResults = document.getElementById('verificationResults');
  
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const idDocument = document.getElementById('idDocument').files[0];
        const secondImage = document.getElementById('secondImage').files[0];
  
        if (!idDocument || !secondImage) {
          alert('Please upload both ID Document and Second Image.');
          return;
        }
  
        // Display loading animation
        verificationResults.innerHTML = `
          <div class="loader">
            <div class="spinner"></div>
            <p>Verifying your documents, please wait...</p>
          </div>
        `;
  
        // Simulate verification process (Replace with actual backend integration)
        setTimeout(() => {
          // Placeholder results
          verificationResults.innerHTML = `
            <h4 class="text-success">Verification Successful!</h4>
            <p>Your identity has been confirmed.</p>
            <h5>Top 5 Similar Images:</h5>
            <ul>
              <li>Image 1 - 98% Similarity</li>
              <li>Image 2 - 95% Similarity</li>
              <li>Image 3 - 93% Similarity</li>
              <li>Image 4 - 90% Similarity</li>
              <li>Image 5 - 88% Similarity</li>
            </ul>
          `;
        }, 3000); // 3-second delay
      });
    }
  
    /* Email Validation Function */
    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }
  });
  