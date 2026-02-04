let colors = [];

// --- Button config ---
let buttons = [
  { label: "RESET", x: 20, y: 20, w: 90, h: 36, action: "reset" },
  { label: "SAVE PNG", x: 120, y: 20, w: 120, h: 36, action: "save" }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  textFont("DM Mono");
  textSize(28);
  textAlign(CENTER, CENTER);

  colors = [
    '#ff595e', '#ffca3a', '#8ac926',
    '#1982c4', '#6a4c93', '#ff6f91',
    '#ff9671', '#ffc75f', '#f9f871'
  ];
}

function draw() {
  if (mouseIsPressed && !overAnyButton()) {
    drawBrush();
  }

  drawButtons();
}

function drawBrush() {
  let col = random(colors);
  fill(col);
  noStroke();

  let jitterX = random(-2, 2);
  let jitterY = random(-2, 2);

  text("SPREAD LOVE!", mouseX + jitterX, mouseY + jitterY);
}

/* ---------- BUTTONS ---------- */

function drawButtons() {
  push();
  rectMode(CORNER);
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let b of buttons) {
    let hover = overButton(b);

    noFill();
    stroke(255);
    strokeWeight(hover ? 2 : 1);
    rect(b.x, b.y, b.w, b.h, 4);

    noStroke();
    fill(255);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1);
  }

  pop();
}

function overButton(b) {
  return (
    mouseX > b.x &&
    mouseX < b.x + b.w &&
    mouseY > b.y &&
    mouseY < b.y + b.h
  );
}

function overAnyButton() {
  return buttons.some(b => overButton(b));
}

function mousePressed() {
  for (let b of buttons) {
    if (overButton(b)) {
      if (b.action === "reset") {
        background(0);
      }
      if (b.action === "save") {
        saveCanvas("spread-love", "png");
      }
    }
  }
}

/* ---------- KEYS & RESIZE ---------- */

function keyPressed() {
  if (key === '1') {
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
