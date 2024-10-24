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
        startDestruction();
    }
}

function startDestruction() {
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    const timerElement = document.getElementById('timer');
    
    countdownElement.classList.remove('hidden');
    
    const interval = setInterval(() => {
        countdown--;
        timerElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(interval);
            destroySite();
        }
    }, 1000);
}

function destroySite() {
    document.body.classList.add('destruction');
}

