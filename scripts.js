// Correct code sequence
const correctCode = ['3', '1', '6', '9', '3', '1', '6', '9'];

function checkCode() {
    const userCode = [];
    
    // Collect user input
    for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`code-${i}`).value;
        userCode.push(input);
    }

    // Check if the entered code matches the correct code
    if (JSON.stringify(userCode) === JSON.stringify(correctCode)) {
        alert('Access Granted!');
    } else {
        fetchUserIPAndLocation(); // Fetch IP and Location if wrong code entered
    }
}

function fetchUserIPAndLocation() {
    const apiKey = 'a261b063b7c517fd40a8c791c9a82175'; // Replace with your ipapi API key
    const apiURL = `https://ipapi.co/json/`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const { ip, city, region, country_name } = data;
            displayIPandLocation(ip, city, region, country_name);
        })
        .catch(error => {
            console.error('Error fetching IP and location:', error);
        });
}

function displayIPandLocation(ip, city, region, country) {
    const locationInfo = `Unauthorized access attempt detected from IP: ${ip}, Location: ${city}, ${region}, ${country}`;
    
    alert(locationInfo); // Alert the user (or log the info)
    
    // Optionally display it on the webpage
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = locationInfo;
    countdownElement.classList.remove('hidden');
}

