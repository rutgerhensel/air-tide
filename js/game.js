// Main game loop — setup, draw, state machine, scoring, input

function setup() {
  createCanvas(windowWidth, windowHeight);
  highScore = int(localStorage.getItem('airTideHighScore') || 0);
  initClouds();
  resetGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function resetGame() {
  player = {
    x: width * 0.25,
    y: 0,
    vy: 0,
    onWave: true,
    hasWings: false,
    wingTimer: 0,
    wingMaxTime: 180,
    jumpHeld: false,
    wasOnWave: true,
  };
  player.y = getWaveY(player.x, 0);

  scrollOffset = 0;
  scrollSpeed = baseScrollSpeed;
  birds = [];
  obstacles = [];
  particles = [];
  score = 0;
  frameScore = 0;
  waveTime = 0;
}

// --- Scoring ---

function updateScore() {
  let multiplier = 1;
  if (!player.onWave) multiplier = 2;
  if (player.hasWings) multiplier = 3;
  frameScore += multiplier;
  score = floor(frameScore / 6);
}

// --- State transitions ---

function gameOver() {
  gameState = STATE_GAMEOVER;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('airTideHighScore', highScore);
  }
}

// --- Draw: state machine ---

function draw() {
  switch (gameState) {
    case STATE_MENU:
      drawMenu();
      break;
    case STATE_PLAYING:
      drawGame();
      break;
    case STATE_GAMEOVER:
      drawGameOverScreen();
      break;
  }
}

function drawGame() {
  waveTime += 1;
  scrollSpeed = baseScrollSpeed + score * 0.002;
  scrollSpeed = min(scrollSpeed, 12);
  scrollOffset += scrollSpeed;

  drawSky();
  updateClouds();
  drawClouds();

  updateBirds();
  drawBirds();

  drawWaves(waveTime);

  updateObstacles();
  drawObstacles();

  updatePlayer();
  drawPlayer();

  updateParticles();
  drawParticles();

  updateScore();

  drawHUD();
}

// --- Input ---

function keyPressed() {
  keys[keyCode] = true;
  keys[key === ' ' ? 32 : keyCode] = true;

  if (keyCode === 32 || key === ' ') {
    if (gameState === STATE_MENU) {
      gameState = STATE_PLAYING;
      resetGame();
    } else if (gameState === STATE_GAMEOVER) {
      gameState = STATE_PLAYING;
      resetGame();
    }
  }
  if (keyCode === 32 || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    return false;
  }
}

function keyReleased() {
  keys[keyCode] = false;
  keys[key === ' ' ? 32 : keyCode] = false;
}

document.addEventListener('contextmenu', e => e.preventDefault());
