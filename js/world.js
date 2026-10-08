// Sky, waves, and clouds

function drawSky() {
  for (let y = 0; y < height * 0.75; y++) {
    let t = y / (height * 0.75);
    let r = lerp(255, 100, t);
    let g = lerp(150, 180, t);
    let b = lerp(80, 240, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }
  noStroke();
}

// --- Waves (Perlin noise) ---

function getWaveY(screenX, time) {
  let nx = (screenX + scrollOffset) * 0.003;
  let nt = time * 0.008;
  let waveBase = height * 0.72;
  return waveBase + noise(nx, nt) * 60 - 30 + sin((screenX + scrollOffset) * 0.02 + time * 0.03) * 15;
}

function drawWaves(time) {
  // back wave (darker, parallax)
  noStroke();
  fill(20, 80, 140, 180);
  beginShape();
  for (let x = 0; x <= width; x += 8) {
    let nx = (x + scrollOffset * 0.7) * 0.004;
    let wy = height * 0.74 + noise(nx, time * 0.006) * 50 - 25 + sin((x + scrollOffset * 0.7) * 0.018 + time * 0.025) * 12;
    vertex(x, wy);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // front wave (main — player rides this)
  fill(30, 120, 200);
  beginShape();
  for (let x = 0; x <= width; x += 6) {
    vertex(x, getWaveY(x, time));
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // foam highlights
  stroke(180, 220, 255, 100);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x <= width; x += 6) {
    vertex(x, getWaveY(x, time) - 2);
  }
  endShape();
  noStroke();

  // deep water below
  fill(10, 50, 100);
  rect(0, height * 0.88, width, height * 0.12);
}

// --- Clouds ---

function initClouds() {
  clouds = [];
  for (let i = 0; i < 12; i++) {
    clouds.push(makeCloud(random(width * 2)));
  }
}

function makeCloud(startX) {
  return {
    x: startX === undefined ? width + random(200, 600) : startX,
    y: random(30, height * 0.35),
    w: random(80, 200),
    h: random(30, 60),
    speed: random(0.2, 0.8),
    alpha: random(150, 230),
  };
}

function updateClouds() {
  for (let c of clouds) {
    c.x -= c.speed + scrollSpeed * 0.3;
    if (c.x + c.w < -50) {
      Object.assign(c, makeCloud());
    }
  }
}

function drawClouds() {
  noStroke();
  for (let c of clouds) {
    fill(255, 255, 255, c.alpha);
    ellipse(c.x, c.y, c.w, c.h);
    ellipse(c.x + c.w * 0.25, c.y - c.h * 0.3, c.w * 0.6, c.h * 0.7);
    ellipse(c.x - c.w * 0.2, c.y - c.h * 0.15, c.w * 0.5, c.h * 0.6);
  }
}
