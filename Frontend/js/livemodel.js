document.addEventListener('DOMContentLoaded', () => {
    const liveVideo = document.getElementById('liveVideo');
    const captureButton = document.getElementById('captureButton');
    const capturedCanvas = document.getElementById('capturedCanvas');
    
    if (liveVideo && captureButton && capturedCanvas) {
      // Start the video stream using the webcam
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          liveVideo.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing camera: ", err);
          alert("Please allow camera access.");
        });
  
      captureButton.addEventListener('click', () => {
        const context = capturedCanvas.getContext('2d');
        capturedCanvas.width = liveVideo.videoWidth;
        capturedCanvas.height = liveVideo.videoHeight;
        context.drawImage(liveVideo, 0, 0, capturedCanvas.width, capturedCanvas.height);
  
        // Convert the captured image into base64 or Blob
        const capturedImage = capturedCanvas.toDataURL('image/png');
  
        // Send captured image to backend for liveness detection and further processing
        fetch('/api/live-capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: capturedImage })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Image capture successful, and verification passed.');
            // Display results or proceed to the next step
          } else {
            alert('Verification failed: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error sending image to backend:', error);
        });
      });
    }
  });
  