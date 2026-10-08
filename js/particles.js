// Particle system — feather bursts and water spray

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'feather') {
      p.vy += 0.08;
      p.vx *= 0.98;
    } else if (p.type === 'spray') {
      p.vy += 0.15;
    }
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let alpha = map(p.life, 0, p.maxLife, 0, 255);
    fill(p.color[0], p.color[1], p.color[2], alpha);
    if (p.type === 'feather') {
      push();
      translate(p.x, p.y);
      rotate(p.vx * 0.5);
      ellipse(0, 0, p.size, p.size * 0.4);
      pop();
    } else {
      ellipse(p.x, p.y, p.size, p.size);
    }
  }
}

function spawnSpray(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: x + random(-10, 10),
      y: y,
      vx: random(-2, 2),
      vy: random(-5, -1),
      life: random(15, 35),
      maxLife: 35,
      type: 'spray',
      color: [200, 230, 255],
      size: random(3, 6),
    });
  }
}
