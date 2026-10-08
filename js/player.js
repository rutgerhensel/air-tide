// Player physics and rendering

function updatePlayer() {
  let waveY = getWaveY(player.x, waveTime);
  let gravity = 0.35;

  // wing boost: reduced gravity
  if (player.hasWings) {
    gravity = 0.18;
    player.wingTimer--;
    if (player.wingTimer <= 0) {
      player.hasWings = false;
    }
  }

  // jump
  if ((keys[UP_ARROW] || keys[32] || keys[87]) && player.onWave) {
    player.vy = -9;
    player.onWave = false;
    spawnSpray(player.x, player.y);
  }

  // extra boost while airborne and holding up
  if ((keys[UP_ARROW] || keys[32] || keys[87]) && !player.onWave && player.vy > -12) {
    player.vy -= 0.25;
  }

  // dive
  if ((keys[DOWN_ARROW] || keys[83]) && !player.onWave) {
    player.vy += 0.6;
  }

  // apply gravity
  if (!player.onWave) {
    player.vy += gravity;
  }

  player.y += player.vy;

  // wave surface collision
  player.wasOnWave = player.onWave;
  if (player.y >= waveY) {
    if (!player.wasOnWave && player.vy > 2) {
      spawnSpray(player.x, waveY);
    }
    player.y = waveY;
    player.vy = 0;
    player.onWave = true;
  } else {
    player.onWave = false;
  }

  // clamp to top of screen
  if (player.y < 20) {
    player.y = 20;
    player.vy = 0;
  }

}

function drawPlayer() {
  let px = player.x;
  let py = player.y;

  push();

  // --- Surfboard ---
  stroke(80, 50, 20);
  strokeWeight(3);
  fill(220, 160, 60);
  beginShape();
  vertex(px - 22, py + 2);
  vertex(px - 10, py + 6);
  vertex(px + 14, py + 6);
  vertex(px + 26, py + 1);
  vertex(px + 14, py - 1);
  vertex(px - 10, py - 1);
  endShape(CLOSE);

  // --- Body (stick figure) ---
  stroke(50);
  strokeWeight(2.5);
  // legs
  line(px - 4, py, px - 2, py - 14);
  line(px + 6, py, px + 3, py - 14);
  // torso
  line(px, py - 14, px, py - 30);
  // arms
  let armAngle = player.onWave ? -0.4 : -0.7;
  line(px, py - 26, px - 10, py - 26 + sin(armAngle) * 8);
  line(px, py - 26, px + 5, py - 32);

  // head
  fill(255, 200, 150);
  noStroke();
  ellipse(px, py - 35, 12, 12);

  // --- Kite line ---
  stroke(150);
  strokeWeight(1);
  let kiteX = px + 30 + sin(waveTime * 0.05) * 10;
  let kiteY = py - 100 + cos(waveTime * 0.04) * 8;
  line(px + 5, py - 32, kiteX, kiteY);

  // --- Kite ---
  noStroke();
  fill(255, 60, 60);
  beginShape();
  vertex(kiteX, kiteY - 15);
  vertex(kiteX + 20, kiteY);
  vertex(kiteX, kiteY + 5);
  vertex(kiteX - 20, kiteY);
  endShape(CLOSE);
  fill(255, 200, 50);
  beginShape();
  vertex(kiteX, kiteY - 10);
  vertex(kiteX + 14, kiteY);
  vertex(kiteX, kiteY + 3);
  vertex(kiteX - 14, kiteY);
  endShape(CLOSE);
  // kite tail
  stroke(255, 60, 60);
  strokeWeight(1.5);
  noFill();
  beginShape();
  vertex(kiteX, kiteY + 5);
  for (let i = 1; i <= 5; i++) {
    vertex(kiteX + sin(waveTime * 0.1 + i) * 8, kiteY + 5 + i * 8);
  }
  endShape();

  // --- Wings (when boosted) ---
  if (player.hasWings) {
    let wingAlpha = player.wingTimer < 40 ? map(player.wingTimer, 0, 40, 50, 220) : 220;
    let wingFlap = sin(frameCount * 0.3) * 8;
    stroke(255, 255, 255, wingAlpha);
    strokeWeight(2);
    fill(255, 255, 255, wingAlpha * 0.5);
    // left wing
    beginShape();
    vertex(px - 3, py - 24);
    vertex(px - 25, py - 30 + wingFlap);
    vertex(px - 18, py - 22 + wingFlap * 0.5);
    endShape(CLOSE);
    // right wing
    beginShape();
    vertex(px + 3, py - 24);
    vertex(px + 25, py - 30 + wingFlap);
    vertex(px + 18, py - 22 + wingFlap * 0.5);
    endShape(CLOSE);
  }

  pop();
}
