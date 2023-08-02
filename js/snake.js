// snake.js

const BOARD_SIZE = 20;
const SQUARE_SIZE = 30;
let direction = { x: 0, y: 1 };
let newDirection = { x: 0, y: 1 }; // to store the most recent direction change
let lock = false;
let snake = [{ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 }];
let food = null;
let gameInterval = null;
let score = 0;  // Add this line at the top of your code to declare the score variable


function startGame() {
    if (gameInterval) return;
    const gameBoard = document.getElementById('game-board');

    // Reset game variables
    direction = { x: 0, y: 1 };
    newDirection = { x: 0, y: 1 };
    lock = false;
    snake = [{ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 }];
    food = null;
    gameBoard.innerHTML = '';
    score = 0;

    // Remove game over message if it exists
    const gameOverMessage = document.getElementById('game-over-message');
    const gameOverScoreMessage = document.getElementById('game-over-score-message');
    const restartMessage = document.getElementById('restart-message');
    const gameOverOverlay = document.getElementById('game-over-overlay');

    if (gameOverMessage && gameOverMessage.parentElement) gameOverMessage.remove();
    if (gameOverScoreMessage && gameOverScoreMessage.parentElement) gameOverMessage.remove();
    if (restartMessage && restartMessage.parentElement) restartMessage.remove();
    if (gameOverOverlay && gameOverOverlay.parentElement) gameOverOverlay.remove();
    
    // Create board squares
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            const square = document.createElement('div');
            square.style.height = SQUARE_SIZE + 'px';
            square.style.width = SQUARE_SIZE + 'px';
            square.style.position = 'absolute';
            square.style.left = `${j * SQUARE_SIZE}px`;
            square.style.top = `${i * SQUARE_SIZE}px`;
            gameBoard.appendChild(square);
        }
    }

    // Create initial food
    createFood(gameBoard);
    
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, 100);  // increased game speed
}

function update() {
moveSnake(document.getElementById('game-board'));
}

function createFood(gameBoard) {
    let candidateFood;
    do {
        candidateFood = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE)
        };
    } 
    
    while (snake.some(part => part.x === candidateFood.x && part.y === candidateFood.y));

    food = candidateFood;

    const foodElement = document.createElement('div');
    foodElement.style.height = SQUARE_SIZE + 'px';
    foodElement.style.width = SQUARE_SIZE + 'px';
    foodElement.style.position = 'absolute';
    foodElement.style.left = `${food.x * SQUARE_SIZE}px`;
    foodElement.style.top = `${food.y * SQUARE_SIZE}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function moveSnake(gameBoard) {
    // update direction
    direction = newDirection;
    lock = false;

    const head = Object.assign({}, snake[0]); // copy head
    head.x += direction.x;
    head.y += direction.y;

    if (food && food.x === head.x && food.y === head.y) {
        // eat the food: do not remove the tail
        gameBoard.querySelector('.food').remove();
        createFood(gameBoard);
        score++;  // Increase the score when the snake eats food
    } else {
        // remove the tail
        snake.pop();
    }

    // game over condition
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= BOARD_SIZE || 
        head.y >= BOARD_SIZE ||
        snake.find(part => part.x === head.x && part.y === head.y)
    ) {
        gameOver();
        return;
    }

    // add new head to snake
    snake.unshift(head);

    // update snake display
    gameBoard.querySelectorAll('.snake-part').forEach(part => part.remove());
    snake.forEach(part => {
        const partElement = document.createElement('div');
        partElement.style.height = SQUARE_SIZE + 'px';
        partElement.style.width = SQUARE_SIZE + 'px';
        partElement.style.position = 'absolute';
        partElement.style.left = `${part.x * SQUARE_SIZE}px`;
        partElement.style.top = `${part.y * SQUARE_SIZE}px`;
        partElement.classList.add('snake-part');
        gameBoard.appendChild(partElement);
    });

    // update score
    document.getElementById('score').textContent = `${score}`;
}

function gameOver() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = null;

    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'game-over-overlay';
    document.getElementById('game-container').appendChild(gameOverOverlay);

    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'GAME OVER';
    gameOverMessage.id = 'game-over-message';
    document.getElementById('game-container').appendChild(gameOverMessage);

    const gameOverScoreMessage = document.createElement('div');
    gameOverScoreMessage.textContent = 'Final Score: ' + score;  // use the score variable
    gameOverScoreMessage.id = 'game-over-score-message';
    document.getElementById('game-container').appendChild(gameOverScoreMessage);

    const restartMessage = document.createElement('div');
    restartMessage.textContent = 'Press space to restart';
    restartMessage.id = 'restart-message';
    document.getElementById('game-container').appendChild(restartMessage);
}

window.onload = () => {
    document.getElementById('start-game').onclick = startGame;
    document.getElementById('fullscreen-button').onclick = () => {
    
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(console.error); 
            }
        }        
    
    };

};



window.onkeydown = e => {
    if (lock) return;
    lock = true;

    switch (e.key) {
        case 'w':
        case 'W':
            if (direction.y !== 1) newDirection = { x: 0, y: -1 };
            break;
        case 'a':
        case 'A':
            if (direction.x !== 1) newDirection = { x: -1, y: 0 };
            break;
        case 's':
        case 'S':
            if (direction.y !== -1) newDirection = { x: 0, y: 1 };
            break;
        case 'd':
        case 'D':
            if (direction.x !== -1) newDirection = { x: 1, y: 0 };
            break;
    }

    
    if (e.code === 'Space') { 
        const gameOverMessage = document.getElementById('game-over-message'); // Remove game over message if it exists
        const gameOverScoreMessage = document.getElementById('game-over-score-message');
        const restartMessage = document.getElementById('restart-message');
        const gameOverOverlay = document.getElementById('game-over-overlay');
        if (gameOverMessage) gameOverMessage.remove();
        if (gameOverScoreMessage) gameOverScoreMessage.remove();
        if (restartMessage) restartMessage.remove();
        if (gameOverOverlay) gameOverOverlay.remove();
        startGame(); // Start a new game
    }
    

};