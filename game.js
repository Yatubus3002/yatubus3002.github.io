
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tam ekran boyutları ayarla
canvas.width = window.innerWidth; // Pencere genişliği
canvas.height = window.innerHeight; // Pencere yüksekliği

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 30,
    gravity: 0.2,
    velocity: 0,
    lift: -2 // Zıplama kuvveti
};

const pipes = [];
const pipeGap = 400;
const pipeWidth = 100;
let score = 0;
let isGameOver = false;
let attempts = 0;
const maxAttempts = 3;

// Kuş resmini yükle
const birdImg = new Image();
birdImg.src = 'bird.png'; // Kuş resminin yolu

// Boru resmini yükle
const pipeImg = new Image();
pipeImg.src = 'pipe.png'; // Boru resminin yolu

function drawBird() {
    ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2); // Kuşun boyutunu iki katına çıkar
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeImg, pipes[i].x, 0, pipeWidth, pipes[i].topHeight); // Üst boru
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].topHeight + pipeGap, pipeWidth, canvas.height - pipes[i].topHeight - pipeGap); // Alt boru
    }
}

function gameOver() {
    isGameOver = true;
    ctx.font = '50px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Zıpla Çıyan Zıpla', canvas.width / 2 - 150, canvas.height / 2 - 50); // Oyun adını ekleyin
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 150, canvas.height / 2 + 50);
}


function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Yüksekliği sınırla
    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
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

        // Çarpışma kontrolü
        if (pipes[i].x <= bird.x + bird.radius && 
            bird.x - bird.radius <= pipes[i].x + pipeWidth && 
            (bird.y - bird.radius <= pipes[i].topHeight || 
             bird.y + bird.radius >= pipes[i].topHeight + pipeGap)) {
            gameOver();
        }

        // Ekrandan çıkan boruları sil
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
            i--;
        }
    }
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    drawScore();

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Zıplama ve yeniden başlatma için olay dinleyicisi
document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && attempts < maxAttempts) {
        if (isGameOver) {
            restartGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

// Tuş olayını dinle ve scroll'u engelle
document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Default kaydırmayı engelle
    }
});

// Mobil cihazlar için dokunma olayını dinle
document.addEventListener('touchstart', function (e) {
    e.preventDefault(); // Default kaydırmayı engelle
});


// Mobil cihazlar için dokunmatik destek
document.addEventListener('touchstart', function (e) {
    if (attempts < maxAttempts) {
        if (isGameOver) {
            restartGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function restartGame() {
    pipes.length = 0;
    bird.y = canvas.height / 2;
    score = 0;
    isGameOver = false;
    attempts++;
    gameLoop();
}

gameLoop();
