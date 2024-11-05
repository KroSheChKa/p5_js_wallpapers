let offset = 35;
let pointers = [];
let x;
let y;
let radius = 200;
let offsetY;

function setup() {
  createCanvas(windowWidth, windowHeight*0.997);
  frameRate(60);
  x = width / offset;
  y = height / offset;
  offsetY = Math.floor(y);
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < y-1; j += 1) {
      let position = createVector(offset*(i + 0.5), offset*(j + 0.5));
      let angle = random(TWO_PI);
      let direction = p5.Vector.fromAngle(angle).mult(8);
      pointers[i * offsetY + j] = new Pointer(position, direction);
    }
  }
}

function draw() {
  background(16);
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < y-1; j += 1) {
      pointers[i * offsetY + j].move();
      pointers[i * offsetY + j].show();
    }
  }
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
      this.direction = p5.Vector.sub(mousePosition, this.position);
      this.direction.normalize();
      this.direction.mult(8);
    }
  }

  show() {
    stroke(255);
    strokeWeight(2);
    line(this.position.x, this.position.y, this.position.x + this.direction.x, this.position.y + this.direction.y);
  }
}
