const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 600;

const birdImage = new Image();
birdImage.src = 'images/dhrubird.png';

const obstacleImage = new Image();
obstacleImage.src = 'images/pipe.png';

let bird = { x: 50, y: canvas.height / 2, width: 34, height: 24 };
let obstacles = [];
let obstacleTimer = 0;
let gameOver = false;
let obstaclesAvoided = 0;

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    if (obstacleTimer === 0) {
        const gapPosition = Math.random() * (canvas.height - 200) + 100;
        obstacles.push({ x: canvas.width, y: gapPosition, width: 50, height: 200 });
    }
    obstacleTimer = (obstacleTimer + 1) % 90;
}

function checkCollision() {
    for (let obstacle of obstacles) {
        if (bird.x < obstacle.x + obstacle.width &&
            bird.x + bird.width > obstacle.x &&
            bird.y < obstacle.y + obstacle.height &&
            bird.y + bird.height > obstacle.y) {
            gameOver = true;
            break;
        }
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawObstacles();

    if (!gameOver) {
        updateObstacles();
        checkCollision();
        requestAnimationFrame(gameLoop);
    } else {
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText(`Dhru eventually answered a question!`, 10, canvas.height - 60);
        context.fillText(`Questions avoided by Dhru: ${obstaclesAvoided}`, 10, canvas.height - 30);
    }
}

birdImage.onload = () => {
    gameLoop();
};
