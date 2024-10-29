const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Kuş ayarları
const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 30, // Boyutu iki katına çıkar
    gravity: 0.2, // Düşme hızını yavaşlat
    velocity: 0,
    lift: -6 // Zıplama kuvveti
};

// Boru ayarları
const pipes = [];
const pipeGap = 600; // Borular arasındaki boşluk
const pipeWidth = 100;
let score = 0;
let isGameOver = false;

// Kuş ve boru görselleri
const birdImg = new Image();
birdImg.src = 'bird.png'; // Kuş görseli

const pipeImg = new Image();
pipeImg.src = 'pipe.png'; // Boru görseli

function drawBird() {
    ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeImg, pipes[i].x, 0, pipeWidth, pipes[i].topHeight); // Üst boru
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].topHeight + pipeGap, pipeWidth, canvas.height - pipes[i].topHeight - pipeGap); // Alt boru
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Kuş ekranın dışına çıkarsa
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver();
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({
            x: canvas.width,
            topHeight: Math.random() * (canvas.height - pipeGap - 300) + 150
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        // Kuş ve boruların çarpışmasını kontrol et
        if (pipes[i].x < bird.x + bird.radius &&
            bird.x - bird.radius < pipes[i].x + pipeWidth &&
            (bird.y - bird.radius < pipes[i].topHeight || bird.y + bird.radius > pipes[i].topHeight + pipeGap)) {
            gameOver();
        }

        // Boruların görünümden çıkması
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++; // Skor artır
            i--; // Boru dizisini güncelle
        }
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 10, 20);
}

function gameOver() {
    isGameOver = true;
    ctx.font = '50px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Zıpla Çıyan Zıpla', canvas.width / 2 - 150, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 150, canvas.height / 2 + 50);
}

function restartGame() {
    pipes.length = 0;
    bird.y = canvas.height / 2;
    score = 0;
    isGameOver = false;
    gameLoop();
}

document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        if (isGameOver) {
            restartGame(); // Oyun bittiğinde yeniden başlat
        } else {
            bird.velocity = bird.lift; // Zıplama
        }
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    drawScore();

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        drawInstructions();
    }
}

// Oyun döngüsünü başlat
gameLoop();
