const player = document.getElementById('player');
let gravity = 2;
let isJumping = false;
let jumpHeight = 50;
let pipes = [];
let score = 0;

// Player Jump
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') jump();
});

function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpCount = 0;
        const jumpInterval = setInterval(() => {
            if (jumpCount < jumpHeight) {
                player.style.bottom = `${parseInt(player.style.bottom) + 5}px`;
                jumpCount += 5;
            } else {
                clearInterval(jumpInterval);
                isJumping = false;
            }
        }, 20);
    }
}

// Gravity Effect
function applyGravity() {
    player.style.bottom = `${parseInt(player.style.bottom) - gravity}px`;
}

// Create Pipes
function createPipe() {
    const pipeTop = document.createElement('div');
    const pipeBottom = document.createElement('div');
    
    pipeTop.classList.add('pipe', 'top');
    pipeBottom.classList.add('pipe', 'bottom');

    // Pipe positions
    const randomHeight = Math.floor(Math.random() * 300) + 100;
    pipeTop.style.height = `${randomHeight}px`;
    pipeBottom.style.height = `${400 - randomHeight}px`;

    document.getElementById('gameContainer').appendChild(pipeTop);
    document.getElementById('gameContainer').appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom });
}

// Move Pipes
function movePipes() {
    pipes.forEach(pipe => {
        const pipeLeft = parseInt(pipe.top.style.left);
        pipe.top.style.left = `${pipeLeft - 2}px`;
        pipe.bottom.style.left = `${pipeLeft - 2}px`;
        
        if (pipeLeft < -80) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.shift();
            score++;
            console.log("Score: ", score);
        }
    });
}

// Game Loop
function gameLoop() {
    applyGravity();
    movePipes();

    // Çarpışma Kontrolü
    pipes.forEach(pipe => {
        const playerBottom = parseInt(player.style.bottom);
        const playerTop = playerBottom + player.clientHeight;
        const playerLeft = parseInt(player.style.left);
        const playerRight = playerLeft + player.clientWidth;

        const pipeLeft = parseInt(pipe.top.style.left);
        const pipeRight = pipeLeft + 80;

        if (
            ((playerTop > window.innerHeight - pipe.bottom.clientHeight || playerBottom < pipe.top.clientHeight) &&
                playerRight > pipeLeft && playerLeft < pipeRight) ||
            playerBottom < 0
        ) {
            alert('Oyun Bitti! Skor: ' + score);
            location.reload();
        }
    });

    requestAnimationFrame(gameLoop);
}

// Başlat
setInterval(createPipe, 2000);
gameLoop();
