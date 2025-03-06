var WIDTH = 240;
var HEIGHT = 135;
var GRID_SIZE = 10;
var COLS = Math.floor(WIDTH / GRID_SIZE);
var ROWS = Math.floor(HEIGHT / GRID_SIZE);

var BLACK = 0;
var WHITE = 16777215;
var GREEN = 65280;
var RED = 16711680;
var BLUE = 255;
var YELLOW = 16776960;

var STATE_MENU = 0;
var STATE_GAME = 1;
var STATE_GAME_OVER = 2;
var gameState = STATE_MENU;

var snake = [];
var direction = 0; 
var nextDirection = 0;
var food = { x: 0, y: 0 };
var score = 0;
var highScore = 0;
var frameCounter = 0;
var speed = 10; 
var speedIncrease = true; 
var isPaused = false;
var FOOD_SIZE = 12;

function resetGame() {
  snake = [
    { x: 5, y: Math.floor(ROWS/2) },
    { x: 4, y: Math.floor(ROWS/2) },
    { x: 3, y: Math.floor(ROWS/2) }
  ];
  direction = 0;
  nextDirection = 0;
  score = 0;
  
  placeFood();
  
  isPaused = false;
  gameState = STATE_GAME;
}

function placeFood() {
  var validPos = false;
  var safeMargin = 2;
  
  while (!validPos) {
    food.x = Math.floor(Math.random() * (COLS - 2*safeMargin)) + safeMargin;
    food.y = Math.floor(Math.random() * (ROWS - 2*safeMargin)) + safeMargin;
    
    validPos = true;
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x === food.x && snake[i].y === food.y) {
        validPos = false;
        break;
      }
    }
  }
}

function drawGame() {
  fillScreen(BLACK);
  
  switch (gameState) {
    case STATE_MENU:
      drawMenu();
      break;
    case STATE_GAME:
      drawSnake();
      drawFood();
      drawScore();
      if (isPaused) {
        drawPause();
      }
      break;
    case STATE_GAME_OVER:
      drawGameOver();
      break;
  }
}

function drawMenu() {
  setTextSize(3);
  setTextColor(GREEN);
  drawString("YILAN", 80, 30);
  
  setTextSize(1);
  setTextColor(WHITE);
  drawString("BASLAMAK ICIN SEL'E BAS", 50, 60);
  drawString("PREV: SOLA DON", 70, 80);
  drawString("NEXT: SAGA DON", 70, 95);
  drawString("SEL: DURAKLAT", 70, 110);
  
  setTextColor(YELLOW);
  drawString("MSI Development", 70, 130);
}

function drawSnake() {
  for (var i = 0; i < snake.length; i++) {
    var color = (i === 0) ? YELLOW : GREEN;
    
    drawFillRect(
      snake[i].x * GRID_SIZE,
      snake[i].y * GRID_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1,
      color
    );
    
    if (i === 0) {
      var eyeSize = 2;
      var eyeOffset = 2;
      
      var eyeX1, eyeY1, eyeX2, eyeY2;
      
      if (direction === 0) { 
        eyeX1 = snake[i].x * GRID_SIZE + GRID_SIZE - eyeOffset;
        eyeY1 = snake[i].y * GRID_SIZE + eyeOffset;
        eyeX2 = snake[i].x * GRID_SIZE + GRID_SIZE - eyeOffset;
        eyeY2 = snake[i].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      } else if (direction === 1) { 
        eyeX1 = snake[i].x * GRID_SIZE + eyeOffset;
        eyeY1 = snake[i].y * GRID_SIZE + GRID_SIZE - eyeOffset;
        eyeX2 = snake[i].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
        eyeY2 = snake[i].y * GRID_SIZE + GRID_SIZE - eyeOffset;
      } else if (direction === 2) { 
        eyeX1 = snake[i].x * GRID_SIZE + eyeOffset;
        eyeY1 = snake[i].y * GRID_SIZE + eyeOffset;
        eyeX2 = snake[i].x * GRID_SIZE + eyeOffset;
        eyeY2 = snake[i].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      } else { 
        eyeX1 = snake[i].x * GRID_SIZE + eyeOffset;
        eyeY1 = snake[i].y * GRID_SIZE + eyeOffset;
        eyeX2 = snake[i].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
        eyeY2 = snake[i].y * GRID_SIZE + eyeOffset;
      }
      
      drawFillRect(eyeX1, eyeY1, eyeSize, eyeSize, BLACK);
      drawFillRect(eyeX2, eyeY2, eyeSize, eyeSize, BLACK);
    }
  }
}

function drawFood() {
  drawFillRect(
    food.x * GRID_SIZE - 1,
    food.y * GRID_SIZE - 1,
    FOOD_SIZE,
    FOOD_SIZE,
    RED
  );
  
  drawFillRect(
    food.x * GRID_SIZE + GRID_SIZE/2 - 1,
    food.y * GRID_SIZE - 3,
    3,
    3,
    GREEN
  );
}

function drawScore() {
  setTextSize(1);
  setTextColor(WHITE);
  drawString("SKOR: " + score, 5, 5);
  drawString("REKOR: " + highScore, 150, 5);
}

function drawPause() {
  setTextSize(2);
  setTextColor(WHITE);
  drawString("DURAKLATILDI", 50, 50);
  
  setTextSize(1);
  drawString("DEVAM ETMEK ICIN SEL'E BAS", 40, 80);
}

function drawGameOver() {
  setTextSize(3);
  setTextColor(RED);
  drawString("OYUN BITTI", 50, 30);
  
  setTextSize(2);
  setTextColor(WHITE);
  drawString("SKOR: " + score, 80, 60);
  
  if (score > highScore) {
    setTextColor(YELLOW);
    drawString("YENI REKOR!", 70, 85);
  }
  
  setTextSize(1);
  setTextColor(WHITE);
  drawString("TEKRAR OYNAMAK ICIN SEL'E BAS", 30, 110);
}

function updateGame() {
  if (isPaused) return;
  
  frameCounter++;
  
  var currentSpeed = speedIncrease ?
    Math.max(5, 10 - Math.floor(snake.length / 5)) : speed;
  
  if (frameCounter % currentSpeed !== 0) return;
  
  direction = nextDirection;
  
  var head = { x: snake[0].x, y: snake[0].y };
  
  if (direction === 0) head.x++; 
  else if (direction === 1) head.y++; 
  else if (direction === 2) head.x--; 
  else if (direction === 3) head.y--; 
  
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver();
    return;
  }
  
  for (var i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }
  
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    
    if (score > highScore) {
      highScore = score;
    }
    
    placeFood();
  } else {
    snake.pop();
  }
}

function gameOver() {
  gameState = STATE_GAME_OVER;
}

function handleInput() {
  if (gameState === STATE_MENU) {
    if (getSelPress()) {
      resetGame();
    }
  } else if (gameState === STATE_GAME) {
    if (getSelPress()) {
      isPaused = !isPaused;
    }
    
    if (!isPaused) {
      if (getPrevPress()) {
        nextDirection = (direction + 3) % 4;
      } else if (getNextPress()) {
        nextDirection = (direction + 1) % 4;
      }
    }
  } else if (gameState === STATE_GAME_OVER) {
    if (getSelPress()) {
      gameState = STATE_MENU;
    }
  }
}

function main() {
  gameState = STATE_MENU;
  
  while (true) {
    var startTime = Date.now();
    
    handleInput();
    
    if (gameState === STATE_GAME) {
      updateGame();
    }
    
    drawGame();
    
    var frameTime = Date.now() - startTime;
    var waitTime = Math.max(1, 50 - frameTime); 
    delay(waitTime);
  }
}

main();
