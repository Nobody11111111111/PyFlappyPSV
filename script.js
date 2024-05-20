// Initialize canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Bird properties
const bird = {
    x: 50,
    y: canvas.height / 2 - 12, // Adjust the y-coordinate as needed
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -1 // Adjust the jump strength as needed
};

// Obstacle properties
const obstacleWidth = 100; // Adjust the width as needed
const obstacleGap = 200; // Adjust the gap between obstacles as needed
let obstacles = [];

// Load images
const birdImage = new Image();
birdImage.src = 'dhrubird.png'; // Replace 'dhrubird.png' with the correct path to your bird image

const obstacleImage = new Image();
obstacleImage.src = 'pipe.png'; // Replace 'pipe.png' with the correct path to your obstacle image

const backgroundImage = new Image();
backgroundImage.src = 'FlappyBG.png'; // Replace 'FlappyBG.png' with the correct path to your background image

// Draw images
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacle.height);
    }
}

// Main game loop
function gameLoop() {
    draw();

    // Move bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Spawn obstacles
    if (Math.random() < 0.02) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - obstacleGap),
            height: Math.random() * (canvas.height - obstacleGap),
        });
    }

    // Move obstacles
    for (let obstacle of obstacles) {
        obstacle.x -= 2; // Adjust obstacle speed as needed
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);

    // Check for collisions
    for (let obstacle of obstacles) {
        if (
            bird.x < obstacle.x + obstacleWidth &&
            bird.x + bird.width > obstacle.x &&
            bird.y < obstacle.y + obstacle.height &&
            bird.y + bird.height > obstacle.y
        ) {
            gameOver();
        }
    }

    requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
    // Stop game loop
    cancelAnimationFrame(gameLoop);

    // Display game over message
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);

    // Display restart button
    ctx.fillStyle = '#fff';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 50);
    ctx.fillStyle = '#000';
    ctx.fillText('Restart', canvas.width / 2 - 35, canvas.height / 2 + 85);

    // Restart game on button click
    canvas.addEventListener('click', function(event) {
        if (
            event.clientX > canvas.width / 2 - 50 &&
            event.clientX < canvas.width / 2 + 50 &&
            event.clientY > canvas.height / 2 + 50 &&
            event.clientY < canvas.height / 2 + 100
        ) {
            startGame();
        }
    });
}

// Start game
function startGame() {
    bird.y = canvas.height / 2 - 12;
    bird.velocity = 0;
    obstacles = [];
    gameLoop();
}

// Start game initially
startGame();
