const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

// Load Bird Image
const birdImage = new Image();
birdImage.src = 'images/dhrubird.png';

// Load Obstacle Image
const obstacleImage = new Image();
obstacleImage.src = 'images/pipe.png';

// Load Background Image
const background = new Image();
background.src = 'images/FlappyBG.png';

// Bird
let bird = { x: 50, y: canvas.height / 2, width: 68, height: 48, gravity: 0.5, jumpStrength: -10 }; // Adjusted width and height

// Obstacles
let obstacles = [];

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateBird() {
    bird.y += bird.gravity;
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 2; // Reduce obstacle speed
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Add new obstacle every few frames
    if (Math.random() < 0.01) { // Adjust obstacle spawn rate as needed
        const gap = 200;
        const obstacleHeight = Math.random() * (canvas.height - gap - 200) + 100; // Adjust obstacle position and scale
        obstacles.push({ x: canvas.width, y: 0, width: 100, height: obstacleHeight }); // Adjusted obstacle width
        obstacles.push({ x: canvas.width, y: obstacleHeight + gap, width: 100, height: canvas.height - obstacleHeight - gap }); // Adjusted obstacle width
    }
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (bird.x < obstacle.x + obstacle.width &&
            bird.x + bird.width > obstacle.x &&
            bird.y < obstacle.y + obstacle.height &&
            bird.y + bird.height > obstacle.y) {
            gameOver();
        }
    });
}

function gameOver() {
    // Stop game logic
    clearInterval(gameLoopId);

    // Display game over screen
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.fillText('Game Over', 180, canvas.height / 2 - 50);
    context.fillText('Dhru eventually answered a question!', 50, canvas.height / 2);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    drawBird();
    drawObstacles();
    updateBird();
    updateObstacles();
    checkCollisions();
}

// Control the bird's jump
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' || event.key === 'ArrowUp') { // Jump on Spacebar or Arrow Up
        bird.y += bird.jumpStrength;
    }
});

const gameLoopId = setInterval(gameLoop, 1000 / 60); // Run game loop at 60 FPS
