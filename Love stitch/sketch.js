let fonts = [];
let currentFontIndex = 0;

const TOP_TEXT = "I love";

let typedText = "";
let placeholderText = "";
let placeholderIndex = 0;
let placeholderWords = ["me", "you", "them", "her", "him"];
let placeholderActive = false;

let lastTypeTime = 0;
let typingSpeed = 120;
let deleting = false;

let heartPath = [];
let textPath = [];

let heartDrawCount = 0;
let textDrawCount = 0;

let fontSize = 72;
let animateText = true;

let introPhase = true;
let introDone = false;

const PINK = "#ed42a3";

let saveBtn, fontBtn, resetBtn, textInput;

/* ------------------------------------------------ */
/* PRELOAD                                          */
/* ------------------------------------------------ */

function preload() {
  fonts[0] = loadFont("Millionaire-Script.ttf");
  fonts[1] = loadFont("BricolageGrotesque_24pt-SemiBold.ttf");
  fonts[2] = loadFont("Sentient-VariableItalic.ttf");
}

/* ------------------------------------------------ */
/* SETUP                                            */
/* ------------------------------------------------ */

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(PINK);
  strokeWeight(1);
  noFill();

  createUI();

  buildHeart();
  rebuildText(true);
}

/* ------------------------------------------------ */
/* DRAW                                             */
/* ------------------------------------------------ */

function draw() {
  background(255);

  /* HEART */
  beginShape();
  for (let i = 0; i < min(heartDrawCount, heartPath.length); i++) {
    vertex(heartPath[i].x, heartPath[i].y);
  }
  endShape();

  if (heartDrawCount < heartPath.length) {
    heartDrawCount += 6;
    return;
  }

  /* TEXT */
  beginShape();
  let max = animateText
    ? min(textDrawCount, textPath.length)
    : textPath.length;

  for (let i = 0; i < max; i++) {
    vertex(textPath[i].x, textPath[i].y);
  }
  endShape();

  if (animateText && textDrawCount < textPath.length) {
    textDrawCount += 4;
  }

  /* INTRO COMPLETE → ENABLE PLACEHOLDER */
  if (introPhase && textDrawCount >= textPath.length) {
    introPhase = false;
    introDone = true;
    placeholderActive = true;
    rebuildText(true);
  }

  updatePlaceholderTyping();
}

/* ------------------------------------------------ */
/* PLACEHOLDER TYPING                               */
/* ------------------------------------------------ */

function updatePlaceholderTyping() {
  if (!placeholderActive || typedText.length > 0) return;

  if (millis() - lastTypeTime < typingSpeed) return;
  lastTypeTime = millis();

  let word = placeholderWords[placeholderIndex];

  if (!deleting) {
    placeholderText = word.substring(0, placeholderText.length + 1);
    if (placeholderText === word) {
      deleting = true;
      typingSpeed = 700;
    }
  } else {
    placeholderText = placeholderText.substring(0, placeholderText.length - 1);
    typingSpeed = 80;

    if (placeholderText.length === 0) {
      deleting = false;
      placeholderIndex = (placeholderIndex + 1) % placeholderWords.length;
      typingSpeed = 120;
    }
  }

  rebuildText(false);
}

/* ------------------------------------------------ */
/* UI                                               */
/* ------------------------------------------------ */

function createUI() {
  saveBtn = createButton("Save PNG");
  saveBtn.position(20, 20);
  styleButton(saveBtn);
  saveBtn.mousePressed(saveCleanImage);

  fontBtn = createButton("Change Font");
  fontBtn.position(120, 20);
  styleButton(fontBtn);
  fontBtn.mousePressed(() => {
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
    rebuildText(true);
  });

  resetBtn = createButton("Reset");
  resetBtn.position(240, 20);
  styleButton(resetBtn);
  resetBtn.mousePressed(resetSketch);

  textInput = createElement("textarea");
  textInput.attribute("placeholder", "Type what you love…");
  textInput.position(20, height - 80);
  textInput.size(260, 50);
  styleInput(textInput);
  textInput.input(() => {
    typedText = textInput.value();
    placeholderActive = false;
    placeholderText = "";
    rebuildText(true);
  });
}

/* ------------------------------------------------ */
/* RESET                                            */
/* ------------------------------------------------ */

function resetSketch() {
  typedText = "";
  placeholderText = "";
  placeholderIndex = 0;
  deleting = false;

  introPhase = true;
  introDone = false;
  placeholderActive = false;

  textInput.value("");

  buildHeart();
  rebuildText(true);
}

/* ------------------------------------------------ */
/* STYLING                                          */
/* ------------------------------------------------ */

function styleButton(btn) {
  btn.style("background", "transparent");
  btn.style("border", "1px solid " + PINK);
  btn.style("color", PINK);
  btn.style("font-family", "Inter, system-ui, sans-serif");
  btn.style("font-size", "13px");
  btn.style("letter-spacing", "0.04em");
  btn.style("padding", "6px 14px");
  btn.style("border-radius", "999px");
  btn.style("cursor", "pointer");

  btn.mouseOver(() => {
    btn.style("background", PINK);
    btn.style("color", "white");
  });

  btn.mouseOut(() => {
    btn.style("background", "transparent");
    btn.style("color", PINK);
  });
}

function styleInput(el) {
  el.style("border", "1px solid " + PINK);
  el.style("font-family", "Inter, system-ui, sans-serif");
  el.style("font-size", "13px");
  el.style("padding", "8px");
  el.style("border-radius", "6px");
  el.style("outline", "none");
}

/* ------------------------------------------------ */
/* SAVE                                             */
/* ------------------------------------------------ */

function saveCleanImage() {
  saveBtn.hide();
  fontBtn.hide();
  resetBtn.hide();
  textInput.hide();

  setTimeout(() => {
    saveCanvas("i-love", "png");
    saveBtn.show();
    fontBtn.show();
    resetBtn.show();
    textInput.show();
  }, 50);
}

/* ------------------------------------------------ */
/* HEART                                            */
/* ------------------------------------------------ */

function buildHeart() {
  heartPath = [];
  heartDrawCount = 0;

  let size = min(width, height) * 0.78;
  let cx = width / 2;
  let cy = height / 2 - 40;

  let start = createVector(
    random([-300, width + 300]),
    random([-300, height + 300])
  );

  heartPath.push(start);

  let core = [];
  for (let i = 0; i <= 520; i++) {
    let t = map(i, 0, 520, 0, TWO_PI);
    let x = 16 * pow(sin(t), 3);
    let y =
      13 * cos(t) -
      5 * cos(2 * t) -
      2 * cos(3 * t) -
      cos(4 * t);

    core.push(createVector(
      cx + x * size * 0.03,
      cy - y * size * 0.03
    ));
  }

  addConnector(heartPath, start, core[0], 30);
  heartPath.push(...core);
}

/* ------------------------------------------------ */
/* TEXT                                             */
/* ------------------------------------------------ */

function rebuildText(shouldAnimate) {
  textPath = [];
  textDrawCount = 0;
  animateText = shouldAnimate;

  let font = fonts[currentFontIndex];
  let secondLine =
    introPhase ? "" :
    typedText.length > 0 ? typedText : placeholderText;

  let lines = [TOP_TEXT, secondLine];

  let maxWidth = width * 0.42;
  fontSize = findBestFontSize(font, lines, maxWidth);

  let lineHeight = fontSize * 1.25;
  let blockHeight = lineHeight * lines.length;
  let startY = height / 2 - blockHeight / 2 + fontSize * 0.9;

  let allPts = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (!line) continue;

    let b = font.textBounds(line, 0, 0, fontSize);
    let x = width / 2 - b.w / 2;
    let y = startY + i * lineHeight;

    let pts = font.textToPoints(line, x, y, fontSize, {
      sampleFactor: 0.18,
      simplifyThreshold: 0
    });

    allPts.push(...pts);
  }

  buildContinuousPath(textPath, allPts);
}

/* ------------------------------------------------ */
/* HELPERS                                          */
/* ------------------------------------------------ */

function findBestFontSize(font, lines, maxW) {
  let size = 96;
  while (true) {
    let tooWide = false;
    for (let l of lines) {
      if (!l) continue;
      if (font.textBounds(l, 0, 0, size).w > maxW) {
        tooWide = true;
        break;
      }
    }
    if (tooWide) size -= 2;
    else break;
    if (size < 24) break;
  }
  return size;
}

function buildContinuousPath(path, pts) {
  if (pts.length === 0) return;

  let start = createVector(pts[0].x, pts[0].y);
  path.push(start);

  let last = start;
  for (let p of pts) {
    let v = createVector(p.x, p.y);
    if (p5.Vector.dist(last, v) > 18) {
      addConnector(path, last, v);
    }
    path.push(v);
    last = v;
  }
}

function addConnector(path, a, b, steps = 12) {
  for (let i = 0; i <= steps; i++) {
    path.push(p5.Vector.lerp(a, b, i / steps));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textInput.position(20, height - 80);
  buildHeart();
  resetSketch();
}
