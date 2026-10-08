// Obstacles — rocks and buoys the player must jump over

let obstacles = [];

function spawnObstacle() {
  let type = random() < 0.5 ? 'rock' : 'buoy';
  obstacles.push({
    x: width + random(50, 150),
    type: type,
    w: type === 'rock' ? random(30, 50) : 20,
    h: type === 'rock' ? random(25, 45) : 35,
    hit: false,
  });
}

function updateObstacles() {
  // spawn based on scroll speed — faster = more frequent
  let spawnRate = max(40, 120 - score * 0.05);
  if (frameCount % floor(spawnRate) === 0) {
    spawnObstacle();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.x -= scrollSpeed;

    // collision with player (only when near the wave surface)
    if (!o.hit) {
      let waveY = getWaveY(o.x, waveTime);
      let oTop = waveY - o.h * 0.7;
      let oLeft = o.x - o.w / 2;
      let oRight = o.x + o.w / 2;

      let px = player.x;
      let py = player.y;
      let playerLeft = px - 15;
      let playerRight = px + 18;
      let playerBottom = py + 6;
      let playerTop = py - 30;

      if (playerRight > oLeft && playerLeft < oRight && playerBottom > oTop && playerTop < waveY) {
        o.hit = true;
        // spawn impact particles
        for (let j = 0; j < 10; j++) {
          particles.push({
            x: o.x + random(-10, 10),
            y: waveY - o.h * 0.3,
            vx: random(-3, 3),
            vy: random(-5, -1),
            life: random(20, 45),
            maxLife: 45,
            type: 'spray',
            color: [255, 255, 255],
            size: random(3, 7),
          });
        }
        gameOver();
      }
    }

    // remove if off screen
    if (o.x < -60) {
      obstacles.splice(i, 1);
    }
  }
}

function drawObstacles() {
  for (let o of obstacles) {
    let waveY = getWaveY(o.x, waveTime);
    push();
    translate(o.x, waveY);

    if (o.type === 'rock') {
      // jagged rock
      noStroke();
      fill(80, 70, 65);
      beginShape();
      vertex(-o.w * 0.5, 0);
      vertex(-o.w * 0.35, -o.h * 0.6);
      vertex(-o.w * 0.1, -o.h);
      vertex(o.w * 0.15, -o.h * 0.75);
      vertex(o.w * 0.35, -o.h * 0.9);
      vertex(o.w * 0.5, -o.h * 0.3);
      vertex(o.w * 0.4, 0);
      endShape(CLOSE);
      // highlight edge
      fill(110, 100, 90);
      beginShape();
      vertex(-o.w * 0.3, -o.h * 0.5);
      vertex(-o.w * 0.08, -o.h * 0.85);
      vertex(o.w * 0.1, -o.h * 0.6);
      vertex(-o.w * 0.05, -o.h * 0.4);
      endShape(CLOSE);
    } else {
      // buoy
      noStroke();
      // pole
      fill(100, 100, 100);
      rect(-2, -o.h, 4, o.h);
      // top ball
      fill(255, 60, 40);
      ellipse(0, -o.h, 16, 16);
      // stripes
      fill(255, 255, 255);
      rect(-2, -o.h * 0.5, 4, 6);
    }

    pop();
  }
}
