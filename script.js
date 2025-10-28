const left = document.getElementById("left-animation");
const right = document.getElementById("right-animation");

const colsLeft = Math.floor((window.innerWidth * 0.4) / 8);
const colsRight = Math.floor((window.innerWidth * 0.4) / 8);
const rows = Math.floor(window.innerHeight / 10);

let t = 0;

// --- STAR ANIMATION (LEFT) ---
function drawLeft() {
  const output = [];
  const cx = Math.floor(colsLeft / 2);
  const cy = Math.floor(rows / 2);

  // rotate slowly
  const angleOffset = t * 0.01; // slow rotation
  const numRays = 12;

  // clear screen
  for (let r = 0; r < rows; r++) {
    output[r] = Array(colsLeft).fill(" ");
  }

  // draw radial lines
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * 2 * Math.PI + angleOffset;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    for (let d = 0; d < Math.min(cx, cy); d++) {
      const x = Math.floor(cx + dx * d);
      const y = Math.floor(cy + dy * d);
      if (x >= 0 && x < colsLeft && y >= 0 && y < rows) {
        // fade brightness with distance
        const fade = 1 - d / Math.min(cx, cy);
        output[y][x] = fade > 0.6 ? "*" : fade > 0.3 ? "+" : ".";
      }
    }
  }

  left.textContent = output.map((r) => r.join("")).join("\n");
}

// --- GRAIN ANIMATION (RIGHT) ---
let dots = [];

function updateDots() {
  // remove faded dots
  dots = dots.filter((dot) => dot.alpha > 0);

  // add new dots occasionally
  if (Math.random() < 1) {
    dots.push({
      x: Math.floor(Math.random() * colsRight),
      y: Math.floor(Math.random() * rows),
      alpha: Math.random() * 0.5 + 0.5, // initial brightness
      fade: Math.random() * 0.005 + 0.002, // fade speed
    });
  }

  // update alpha
  for (let d of dots) {
    d.alpha -= d.fade;
  }
}

function drawRight() {
  updateDots();

  const output = [];
  for (let r = 0; r < rows; r++) {
    output[r] = Array(colsRight).fill(" ");
  }

  for (let d of dots) {
    if (d.x >= 0 && d.x < colsRight && d.y >= 0 && d.y < rows) {
      const brightness = d.alpha;
      let char = " ";
      if (brightness > 0.6) char = "*";
      else if (brightness > 0.3) char = ".";
      output[d.y][d.x] = char;
    }
  }

  right.textContent = output.map((r) => r.join("")).join("\n");
}

function animate() {
  drawLeft();
  drawRight();
  t++;
  setTimeout(() => requestAnimationFrame(animate), 50); // slower frame rate (~20 FPS)
}

animate();
