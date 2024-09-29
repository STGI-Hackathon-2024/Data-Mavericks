// Function to make an API call with the email in the body
async function setName(email) {
    const apiUrl = 'http://127.0.0.1:5000/api/user'; // Replace with your actual API endpoint

    try {
        console.log(email)
        const response = await fetch(apiUrl, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify({email: email }) // Include the email in the request body
        });
        console.log(response);
        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log('Response from API:', data);
        console.log(data.email)
        document.getElementById('welcomemessage').textContent = `Welcome, ${data.user_details.email}`;
        // You can handle the response data here as needed
        return data;
    } catch (error) {
        console.error('Error sending email to API:', error);
    }
}

// Example usage
const emailToSend = localStorage.getItem('userEmail');
setName(emailToSend);

// fetch('http://127.0.0.1:5000/api/user')
//   .then(response => response.json())
//   .then(data => {
//     const username = data.username;  // Assuming 'username' is the key in the response
//     document.getElementById('welcomemessage').textContent = `Welcome, ${username}`;
//   })
//   .catch(error => console.error('Error fetching username:', error));


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

 document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const documentType = document.getElementById('documentType').value;
            const idDocument = document.getElementById('idDocument').files[0];
            const secondImage = document.getElementById('secondImage').files[0];

            if (!documentType || !idDocument || !secondImage) {
                alert('Please fill in all required fields and upload the necessary documents.');
                return;
            }

            const formDataID = new FormData();
            formDataID.append('documentType', documentType);
            formDataID.append('idDocument', idDocument);

            const formDataSecondImage = new FormData();
            formDataSecondImage.append('secondImage', secondImage);

            try {
                // Call the API for the ID Document upload
                const idDocumentResponse = await fetch('http://127.0.0.1:5000/api/upload_id_document', {
                    method: 'POST',
                    body: formDataID,
                });

                const secondImageResponse = await fetch('http://127.0.0.1:5000/api/upload_second_image', {
                    method: 'POST',
                    body: formDataSecondImage,
                });

                const idDocumentResult = await idDocumentResponse.json();
                const secondImageResult = await secondImageResponse.json();

                if (idDocumentResponse.ok && secondImageResponse.ok) {
                    alert('Both documents uploaded successfully!');
                } else {
                    alert(`Error: ${idDocumentResult.message || secondImageResult.message || 'Upload failed!'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});


 