const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

// Load Bird Image
const birdImage = new Image();
birdImage.src = 'images/dhrubird.png';

// Load Background Image
const background = new Image();
background.src = 'images/FlappyBG.png';

// Bird
let bird = { x: 50, y: canvas.height / 2, width: 34, height: 24, gravity: 0.5, jumpStrength: -10 };

// Obstacles
let obstacles = [];

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
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

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Add new obstacle every few frames
    if (Math.random() < 0.02) { // Adjust obstacle spawn rate as needed
        const obstacleHeight = Math.random() * (canvas.height - 200) + 100;
        obstacles.push({ x: canvas.width, y: 0, width: 50, height: obstacleHeight });
        obstacles.push({ x: canvas.width, y: obstacleHeight + 100, width: 50, height: canvas.height - obstacleHeight - 100 });
    }
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
