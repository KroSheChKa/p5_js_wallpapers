let offset = 40;
let pointers = [];
let x;
let y;
let radius = 300;
let offsetY;
let prev_mouseX = -1, prev_mouseY = -1;
let floored_mouseX, floored_mouseY;
let freeze;
let frozen = false;

function setup() {
  createCanvas(windowWidth, windowHeight*0.996);
  freeze = createGraphics(windowWidth, windowHeight * 0.996);
  frameRate(60);
  x = width / offset;
  y = height / offset;
  offsetY = Math.floor(y);
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < offsetY; j += 1) {
      let position = createVector(offset*(i + 0.5), offset*(j + 0.5));
      let angle = random(TWO_PI);
      let direction = p5.Vector.fromAngle(angle).mult(8);
      pointers[i * offsetY + j] = new Pointer(position, direction);
    }
  }
}
function draw() {
  floored_mouseX = floor(mouseX);
  floored_mouseY = floor(mouseY);

  if (floored_mouseX != prev_mouseX || floored_mouseY != prev_mouseY) {

    frozen = false;

    background(16);
    for (let i = 0; i < pointers.length; i++) {
      pointers[i].move();
      pointers[i].show();
    }
    if (!frozen) {
      freeze.clear();
      freeze.image(get(), 0, 0);
      frozen = true;
    }
  } else {
    
    image(freeze, 0, 0);
  }

  prev_mouseX = floored_mouseX;
  prev_mouseY = floored_mouseY;
}

class Pointer {
  constructor(position, direction) {
    this.position = position;
    this.direction = direction;
  }

  move() {
    let mousePosition = createVector(mouseX, mouseY);
    let dx = mousePosition.x - this.position.x;
    let dy = mousePosition.y - this.position.y;
    let distanceSq = dx * dx + dy * dy;
    
    if (distanceSq < radius * radius) {
      let mag = sqrt(distanceSq) / 141;
      this.direction.set(dx, dy).normalize().mult(8 + mag);
    }
    return (distanceSq < radius * radius)
  }

  show() {
    stroke(255);
    strokeWeight(2);
    line(this.position.x, this.position.y, this.position.x + this.direction.x, this.position.y + this.direction.y);
  }
}
