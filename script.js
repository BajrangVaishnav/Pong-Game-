// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameRunning = false;
let gameStarted = false;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = 6;

// Player paddle (left)
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Computer paddle (right)
const computerPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0,
    speed: 4
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 6,
    dx: 5,
    dy: 5,
    speed: 5
};

// Mouse tracking
let mouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        toggleGame();
    }
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// for mobile 
let isClicked = false;
let btn = document.getElementById('btn-play');
btn.addEventListener('click', function(){
    isClicked= !isClicked;
    btn.innerHTML = isClicked ?
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-420 0 1500 540"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 248C288 234.7 277.3 224 264 224C250.7 224 240 234.7 240 248L240 392C240 405.3 250.7 416 264 416C277.3 416 288 405.3 288 392L288 248zM400 248C400 234.7 389.3 224 376 224C362.7 224 352 234.7 352 248L352 392C352 405.3 362.7 416 376 416C389.3 416 400 405.3 400 392L400 248z"/></svg>'
    :
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-420 0 1500 540"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM276.5 211.5C269.1 207 259.8 206.8 252.2 211C244.6 215.2 240 223.3 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4zM362 320L288 365.2L288 274.8L362 320z"/></svg>'
    toggleGame();

})

// Toggle game state
function toggleGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameRunning = true;
    } else {
        gameRunning = !gameRunning;
    }
    updateStatus();
}

// Reset game
function resetGame() {
    playerPaddle.score = 0;
    computerPaddle.score = 0;
    gameRunning = false;
    gameStarted = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 5;
    updateStatus();
    updateScore();
}

// Update game status text
function updateStatus() {
    const statusEl = document.getElementById('gameStatus');
    if (!gameStarted) {
        statusEl.textContent = '▶️ Press SPACE to Start';
    } else if (gameRunning) {
        statusEl.textContent = '⏸️ Press SPACE to Pause';
    } else {
        statusEl.textContent = '▶️ Press SPACE to Resume';
    }
}

// Update score display
function updateScore() {
    document.getElementById('playerScore').textContent = playerPaddle.score;
    document.getElementById('computerScore').textContent = computerPaddle.score;
}

let btn_l_clicked = false;
let btn_r_clicked = false;

let btn_l = document.getElementById('btn-left');
let btn_r = document.getElementById('btn-right');

// UP button
btn_l.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btn_l_clicked = true;
});

btn_l.addEventListener('pointerup', () => {
    btn_l_clicked = false;
});

btn_l.addEventListener('pointercancel', () => {
    btn_l_clicked = false;
});

// DOWN button
btn_r.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btn_r_clicked = true;
});

btn_r.addEventListener('pointerup', () => {
    btn_r_clicked = false;
});

btn_r.addEventListener('pointercancel', () => {
    btn_r_clicked = false;
});

// Move player paddle with mouse and keyboard
function movePlayerPaddle() {

    let targetY = mouseY;

    // UP controls
    if (
        keys['ArrowUp'] ||
        keys['w'] ||
        btn_l_clicked
    ) {
        targetY = playerPaddle.y - paddleSpeed;
    }

    // DOWN controls
    else if (
        keys['ArrowDown'] ||
        keys['s'] ||
        btn_r_clicked
    ) {
        targetY = playerPaddle.y + paddleSpeed;
    }

    playerPaddle.y = targetY;

    // Keep mouse position synced with button movement
    if (btn_l_clicked || btn_r_clicked) {
        mouseY = targetY;
    }

    // Paddle boundaries
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }

    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Move computer paddle (AI)
function moveComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;
    
    // Simple AI: follow the ball
    if (computerCenter < ballCenter - 35) {
        computerPaddle.y += computerPaddle.speed;
    } else if (computerCenter > ballCenter + 35) {
        computerPaddle.y -= computerPaddle.speed;
    }
    
    // Keep paddle within bounds
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    } else if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }
    
    // Ball collision with player paddle
    if (isColliding(ball, playerPaddle)) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        
        // Add spin based on paddle hit location
        const hitPos = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        ball.dy += hitPos * 3;
    }
    
    // Ball collision with computer paddle
    if (isColliding(ball, computerPaddle)) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
        
        // Add spin based on paddle hit location
        const hitPos = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
        ball.dy += hitPos * 3;
    }
    
    // Ball out of bounds (scoring)
    if (ball.x - ball.radius < 0) {
        computerPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerPaddle.score++;
        resetBall();
    }
    
    updateScore();
}

// Check collision between ball and paddle
function isColliding(ball, paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y
    );
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 5;
}

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Main render function
function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawCenterLine();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    drawBall();
}

// Main game loop
function gameLoop() {
    if (gameRunning) {
        movePlayerPaddle();
        moveComputerPaddle();
        updateBall();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    updateStatus();
    updateScore();
    gameLoop();
}

// Start the game
init();