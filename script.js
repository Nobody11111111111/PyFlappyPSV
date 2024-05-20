const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

let bird = { x: 50, y: canvas.height / 2, width: 34, height: 24 };
let gravity = 0.5;
let jumpStrength = -10;
let jumping = false;

function drawBird() {
    context.fillStyle = 'red';
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.y += gravity;
    if (jumping) {
        bird.y += jumpStrength;
        jumping = false;
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        jumping = true;
    }
});

gameLoop();
