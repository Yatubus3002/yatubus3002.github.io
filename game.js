const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 100,
    y: canvas.height / 2,
    radius: 30,
    gravity: 0.2,
    velocity: 0,
    lift: -12
};

const pipes = [];
const pipeGap = 250;
const pipeWidth = 100;
let score = 0;
let isGameOver = false;
let attempts = 0;
const maxAttempts = 30;

// Load the bird image
const birdImg = new Image();
birdImg.src = 'bird.png'; // Set your bird image file path here

// Load the pipe image
const pipeImg = new Image();
pipeImg.src = 'pipe.png'; // Set your pipe image file path here

function drawBird() {
    ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeImg, pipes[i].x, 0, pipeWidth, pipes[i].topHeight); // Top pipe
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].topHeight + pipeGap, pipeWidth, canvas.height - pipes[i].topHeight - pipeGap); // Bottom pipe
    }
}

function gameOver() {
    isGameOver = true;
    ctx.font = '50px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 150, canvas.height / 2 + 50);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

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

        // Collision detection
        if (pipes[i].x <= bird.x + bird.radius && 
            bird.x - bird.radius <= pipes[i].x + pipeWidth && 
            (bird.y - bird.radius <= pipes[i].topHeight || 
             bird.y + bird.radius >= pipes[i].topHeight + pipeGap)) {
            gameOver();
        }

        // Remove off-screen pipes
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

// Add event listener for jump and restart
document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && attempts < maxAttempts) {
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
