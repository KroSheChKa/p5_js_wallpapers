let offset = 30;
let pointers = [];
let x;
let y;
let radius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight*0.997);
  x = width / offset;
  y = height / offset;
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < y-1; j += 1) {
      let position = createVector(i * offset, j * offset);
      let angle = random(TWO_PI); // Случайный угол от 0 до 2π
      let direction = p5.Vector.fromAngle(angle).mult(8); // Создаем вектор длиной 8
      pointers[i * Math.floor(y) + j] = new Pointer(position, direction);
    }
  }
}

function draw() {
  background(16);
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < y-1; j += 1) {
      pointers[i * Math.floor(y) + j].move();
      pointers[i * Math.floor(y) + j].show();
    }
  }
}

class Pointer {
  constructor(position, direction) {
    this.position = position;
    this.direction = direction; // Задаем случайное начальное направление
  }

  move() {
    let mousePosition = createVector(mouseX, mouseY);
    let distance = dist(mousePosition.x, mousePosition.y, this.position.x, this.position.y);
    
    if (distance < radius) {
      // Если в пределах радиуса, обновляем направление
      this.direction = p5.Vector.sub(mousePosition, this.position);
      this.direction.normalize();
      this.direction.mult(8);
    }
    // Если вне радиуса, не обновляем `direction`, линия остается в последнем направлении
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    stroke(255);
    strokeWeight(2);
    line(0, 0, this.direction.x, this.direction.y);
    pop();
  }
}