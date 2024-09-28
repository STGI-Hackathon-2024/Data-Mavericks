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