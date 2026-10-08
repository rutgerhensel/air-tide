// Bird spawning, movement, collision, and rendering

function spawnBird() {
  birds.push({
    x: width + random(50, 150),
    y: random(height * 0.15, height * 0.55),
    speed: random(2, 4.5),
    wingPhase: random(TWO_PI),
    size: random(18, 30),
  });
}

function updateBirds() {
  // spawn
  if (frameCount % 50 === 0 || (birds.length < 2 && frameCount % 25 === 0)) {
    spawnBird();
  }

  for (let i = birds.length - 1; i >= 0; i--) {
    let b = birds[i];
    b.x -= b.speed + scrollSpeed;
    b.wingPhase += 0.15;

    // collision with player
    let dx = b.x - player.x;
    let dy = b.y - player.y;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist < b.size + 18) {
      // feather burst
      for (let j = 0; j < 12; j++) {
        particles.push({
          x: b.x,
          y: b.y,
          vx: random(-3, 3),
          vy: random(-4, 1),
          life: random(30, 60),
          maxLife: 60,
          type: 'feather',
          color: [255, 255, 255],
          size: random(3, 7),
        });
      }
      // give wing boost
      player.hasWings = true;
      player.wingTimer = player.wingMaxTime;
      player.vy = -7;
      birds.splice(i, 1);
      continue;
    }

    // remove if off screen
    if (b.x < -50) {
      birds.splice(i, 1);
    }
  }
}

function drawBirds() {
  for (let b of birds) {
    push();
    translate(b.x, b.y);
    fill(40, 40, 50);
    noStroke();
    // body
    ellipse(0, 0, b.size * 0.8, b.size * 0.35);
    // wings
    let flapY = sin(b.wingPhase) * b.size * 0.5;
    stroke(40, 40, 50);
    strokeWeight(2.5);
    noFill();
    // left wing
    beginShape();
    vertex(-2, 0);
    vertex(-b.size * 0.6, flapY - b.size * 0.15);
    vertex(-b.size, flapY);
    endShape();
    // right wing
    beginShape();
    vertex(2, 0);
    vertex(b.size * 0.6, flapY - b.size * 0.15);
    vertex(b.size, flapY);
    endShape();
    // beak
    fill(255, 180, 50);
    noStroke();
    triangle(b.size * 0.4, -1, b.size * 0.4, 2, b.size * 0.65, 1);
    pop();
  }
}
