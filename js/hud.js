// HUD, menu screen, and game over screen

function drawHUD() {
  push();
  textAlign(LEFT, TOP);
  textSize(22);
  textStyle(BOLD);

  // score
  fill(0, 0, 0, 60);
  text('Score: ' + score, 22, 22);
  fill(255);
  text('Score: ' + score, 20, 20);

  // multiplier indicator
  let multLabel = '';
  if (player.hasWings) {
    multLabel = 'x3 WINGS!';
    fill(255, 220, 50);
  } else if (!player.onWave) {
    multLabel = 'x2 AIR';
    fill(150, 220, 255);
  }
  if (multLabel) {
    textSize(18);
    text(multLabel, 20, 48);
  }

  // high score
  textAlign(RIGHT, TOP);
  textSize(16);
  fill(0, 0, 0, 60);
  text('Best: ' + highScore, width - 18, 22);
  fill(255, 220, 100);
  text('Best: ' + highScore, width - 20, 20);

  // wing boost meter
  if (player.hasWings) {
    let barW = 120;
    let barH = 8;
    let barX = 20;
    let barY = 72;
    let pct = player.wingTimer / player.wingMaxTime;
    fill(0, 0, 0, 80);
    rect(barX, barY, barW, barH, 4);
    fill(255, 220, 50);
    rect(barX, barY, barW * pct, barH, 4);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(10);
    text('WINGS', barX, barY + barH + 2);
  }

  // airtime meter (height above wave)
  let waveY = getWaveY(player.x, waveTime);
  let airHeight = max(0, waveY - player.y);
  if (airHeight > 5) {
    let barW = 6;
    let barMaxH = 100;
    let barX = 12;
    let barY = height * 0.4;
    let barH = min(airHeight / 3, barMaxH);
    fill(0, 0, 0, 40);
    rect(barX, barY, barW, barMaxH, 3);
    fill(100, 200, 255, 180);
    rect(barX, barY + barMaxH - barH, barW, barH, 3);
  }

  pop();
}

function drawMenu() {
  waveTime += 0.5;
  drawSky();
  updateClouds();
  drawClouds();
  drawWaves(waveTime);

  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  // shadow
  fill(0, 0, 0, 80);
  textSize(72);
  text('AIR TIDE', width / 2 + 3, height * 0.3 + 3);

  // main title
  fill(255);
  textSize(72);
  text('AIR TIDE', width / 2, height * 0.3);

  // subtitle
  fill(255, 255, 200);
  textSize(20);
  textStyle(NORMAL);
  text('Kite Surfing', width / 2, height * 0.3 + 50);

  // prompt (blinking)
  if (frameCount % 60 < 40) {
    fill(255);
    textSize(22);
    text('Press SPACE to start', width / 2, height * 0.55);
  }

  // high score
  if (highScore > 0) {
    fill(255, 220, 100);
    textSize(18);
    text('High Score: ' + highScore, width / 2, height * 0.63);
  }

  // controls
  fill(200, 220, 255);
  textSize(14);
  text('UP / SPACE = jump & fly    DOWN = dive', width / 2, height * 0.9);
  text('Hit birds to steal their wings!', width / 2, height * 0.9 + 22);

  pop();
}

function drawGameOverScreen() {
  // keep drawing the world frozen
  drawSky();
  drawClouds();
  drawWaves(waveTime);
  drawObstacles();
  drawBirds();
  drawPlayer();
  drawParticles();

  // dark overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  // wipeout text
  fill(255, 80, 80);
  textSize(56);
  text('WIPEOUT!', width / 2, height * 0.3);

  // score
  fill(255);
  textSize(30);
  text('Score: ' + score, width / 2, height * 0.45);

  // high score
  fill(255, 220, 100);
  textSize(22);
  if (score >= highScore) {
    text('NEW HIGH SCORE!', width / 2, height * 0.53);
  } else {
    text('Best: ' + highScore, width / 2, height * 0.53);
  }

  // restart prompt
  if (frameCount % 60 < 40) {
    fill(255);
    textSize(20);
    textStyle(NORMAL);
    text('Press SPACE to restart', width / 2, height * 0.65);
  }

  pop();
}
