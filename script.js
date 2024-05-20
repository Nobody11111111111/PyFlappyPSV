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
let gravity = 0.8;
let jumpStrength = -40; // Adjusted jump strength

// Obstacles
let obstacles = [];
let obstacleSpeed = 2; // Adjusted obstacle speed

// Game Over state
let isGameOver = false;

// Define Retry Button
const retryButton = {
    x: 200,
    y: canvas.height / 2 + 50,
    width: 100,
    height: 40,
    draw: function() {
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText('Retry', this.x + 20, this.y + 25);
    },
    handleClick: function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
            // Restart game
            restartGame();
        }
    }
};

// Event listener for retry button click
canvas.addEventListener('click', function(event) {
    retryButton.handleClick(event);
});

// Restart game function
function restartGame() {
    // Reset bird position
    bird.y = canvas.height / 2;
    
    // Reset obstacles
    obstacles = [];
    
    // Reset game over state
    isGameOver = false;
    
    // Restart game loop
    gameLoopId = setInterval(gameLoop, 1000 / 60);
}

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
    if (Math.random() < 0.007) { // Adjust obstacle spawn rate as needed
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

    // Draw retry button
    retryButton.draw();

    // Display questions avoided count
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText('Questions Avoided by Dhru: ' + obstacles.length, 120, canvas.height / 2);
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

let gameLoopId = setInterval(gameLoop, 1000 / 60); // Run game loop at 60 FPS

// Event listener for jump
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});
