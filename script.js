const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

// Load Bird Image
const birdImage = new Image();
birdImage.src = 'images/dhrubird.png'; // Replace 'dhrubird.png' with your bird image file

// Load Obstacle Image
const obstacleImage = new Image();
obstacleImage.src = 'images/pipe.png'; // Replace 'pipe.png' with your obstacle image file

// Load Background Image
const backgroundImage = new Image();
backgroundImage.src = 'images/FlappyBG.png'; // Replace 'FlappyBG.png' with your background image file

// Bird
let bird = { x: 50, y: canvas.height / 2, width: 100, height: 100 }; // Adjusted width and height
let gravity = 0.3;
let jumpStrength = 6; // Adjusted jump strength

// Obstacles
let obstacles = [];
let obstacleSpeed = 2; // Adjusted obstacle speed

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateBird() {
    bird.y += gravity;
}

function jump() {
    bird.y += jumpStrength;
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Add new obstacle every few frames
    if (Math.random() < 0.01) { // Adjust obstacle spawn rate as needed
        const obstacleY = Math.random() * (canvas.height - 200) + 50; // Adjust obstacle position
        obstacles.push({ x: canvas.width, y: obstacleY, width: 100, height: 200 }); // Adjusted obstacle width and height
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

    // Display game over message
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.fillText('Game Over', 180, canvas.height / 2 - 50);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawBird();
    drawObstacles();
    updateBird();
    updateObstacles();
    checkCollisions();
}

const gameLoopId = setInterval(gameLoop, 1000 / 60); // Run game loop at 60 FPS

// Event listener for jump
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});
