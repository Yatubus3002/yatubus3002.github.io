const player = document.getElementById('player');
let gravity = 2;
let isJumping = false;
let jumpHeight = 50;
let pipes = [];
let score = 0;
let gameStarted = false; // Oyunun başlamış olup olmadığını kontrol eden değişken

// Karakterin başlangıç pozisyonu
player.style.bottom = '50%';

// Oyuncu zıplama işlevi
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
                const fallInterval = setInterval(() => {
                    if (parseInt(player.style.bottom) > 0) {
                        player.style.bottom = `${parseInt(player.style.bottom) - gravity}px`;
                    } else {
                        clearInterval(fallInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }
}

// Yerçekimi etkisi
function applyGravity() {
    if (parseInt(player.style.bottom) > 0) {
        player.style.bottom = `${parseInt(player.style.bottom) - gravity}px`;
    }
}

// Boru oluşturma
function createPipe() {
    const pipeTop = document.createElement('div');
    const pipeBottom = document.createElement('div');

    pipeTop.classList.add('pipe', 'top');
    pipeBottom.classList.add('pipe', 'bottom');

    // Rastgele yükseklik ayarla
    const randomHeight = Math.floor(Math.random() * 200) + 100;
    pipeTop.style.height = `${randomHeight}px`;
    pipeBottom.style.height = `${400 - randomHeight}px`;

    pipeTop.style.left = '100%';
    pipeBottom.style.left = '100%';

    document.getElementById('gameContainer').appendChild(pipeTop);
    document.getElementById('gameContainer').appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom });
}

// Boruları hareket ettir
function movePipes() {
    pipes.forEach((pipe, index) => {
        const pipeLeft = parseInt(pipe.top.style.left);
        if (pipeLeft > -80) {
            pipe.top.style.left = `${pipeLeft - 2}px`;
            pipe.bottom.style.left = `${pipeLeft - 2}px`;
        } else {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(index, 1);
            score++;
            console.log("Score: ", score);
        }
    });
}

// Çarpışma kontrolü
function checkCollision() {
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
}

// Oyun döngüsü
function gameLoop() {
    if (gameStarted) {
        applyGravity();
        movePipes();
        checkCollision();
    }
    requestAnimationFrame(gameLoop);
}

// Başlat
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        if (!gameStarted) {
            gameStarted = true; // Oyun başlamış oldu
            setInterval(createPipe, 2000); // Boruları oluşturmaya başla
        }
        jump(); // Zıpla
    }
});

// İlk oyun döngüsü çağrısı
gameLoop();
