const player = document.getElementById('player');
let isJumping = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && !isJumping) {
        isJumping = true;
        let jumpHeight = 0;
        const jumpInterval = setInterval(() => {
            if (jumpHeight < 100) {
                player.style.bottom = `${parseInt(player.style.bottom) + 2}px`;
                jumpHeight += 2;
            } else {
                clearInterval(jumpInterval);
                const fallInterval = setInterval(() => {
                    if (jumpHeight > 0) {
                        player.style.bottom = `${parseInt(player.style.bottom) - 2}px`;
                        jumpHeight -= 2;
                    } else {
                        clearInterval(fallInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }
});
