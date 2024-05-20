const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

// Background Image
const background = new Image();
background.src = 'images/FlappyBG.png';
background.onload = () => {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
};

// Bird
let bird = { x: 50, y: canvas.height / 2, width: 34, height: 24, gravity: 0.5, jumpStrength: -10 };

// Obstacles
let obstacles = [];

function drawBird() {
    context.fillStyle = 'red'; // Set bird color
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.fillStyle = 'green'; // Set obstacle color
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateBird() {
    bird.y += bird.gravity;
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 5; // Adjust obstacle speed as needed
    });

    // Add new obstacles or remove off-screen ones as necessary
    // Add code here to generate new obstacles
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    drawBird();
    drawObstacles();
    updateBird();
    updateObstacles();

    requestAnimationFrame(gameLoop);
}

// Control the bird's jump
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' || event.key === 'ArrowUp') { // Jump on Spacebar or Arrow Up
        bird.y += bird.jumpStrength;
    }
});

gameLoop();
