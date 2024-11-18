let pointers = [];
let x;
let y;
let prev_mouseX = -1, prev_mouseY = -1;
let floored_mouseX, floored_mouseY;
let freeze;
let frozen = false;
let lastOffset;

// walpaper engine
let backgroundColor = [16, 16, 16];
let lineColor = [255, 255, 255];
let lineWidth = 2
let radius = 100;
let outerRadius = 300;
let interpolationRate = 0.2;
let offset = 40;
let lineLength = 9;
let magDivisor = 30;
let framesPerSecond = 60;

window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (properties.background_color) {
      let color = properties.background_color.value.split(' ');
      backgroundColor = color.map(c => Math.floor(c * 255));
    }
    if (properties.line_color1) {
      let color = properties.line_color1.value.split(' ');
      lineColor = color.map(c => Math.floor(c * 255));
    }
    if (properties.line_width) {
      lineWidth = properties.line_width.value;
    }
    if (properties.range) {
      radius = properties.range.value;
    }
    if (properties.outer_range) {
      outerRadius = properties.outer_range.value;
    }
    if (properties.interpolation_rate) {
      interpolationRate = properties.interpolation_rate.value;
    }
    if (properties.line_length) {
      lineLength = properties.line_length.value;
    }
    if (properties.mag_divisor) {
      magDivisor = properties.mag_divisor.value;
    }
    if (properties.frames_per_second) {
      framesPerSecond = properties.frames_per_second.value;
      frameRate(framesPerSecond);
    }
    if (properties.lines_offset) {
      offset = properties.lines_offset.value;
      if (offset !== lastOffset) {
        initializePointers();
        lastOffset = offset;
      }
    }
  }
};


function setup() {
  createCanvas(windowWidth, windowHeight * 0.996);
  freeze = createGraphics(windowWidth, windowHeight * 0.996);
  frameRate(framesPerSecond);
  initializePointers();
}

function initializePointers() {
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2])
  freeze.background(backgroundColor[0], backgroundColor[1], backgroundColor[2])
  pointers = [];
  x = width / offset;
  y = height / offset;
  let offsetY = Math.floor(y);
  
  for (let i = 0; i < x; i += 1) {
    for (let j = 0; j < offsetY; j += 1) {
      let position = createVector(offset * (i + 0.5), offset * (j + 0.5));
      let angle = random(TWO_PI);
      let direction = p5.Vector.fromAngle(angle).mult(lineLength);
      let index = i * offsetY + j
      pointers[index] = new Pointer(position, direction);
      pointers[index].move(0);
      pointers[index].show();
    }
  }
  freeze.clear();
  freeze.image(get(), 0, 0);
  frozen = true;
}

function mousePressed() {
  initializePointers();
}

function draw() {
  floored_mouseX = floor(mouseX);
  floored_mouseY = floor(mouseY);

  if (floored_mouseX != prev_mouseX || floored_mouseY != prev_mouseY) {

    frozen = false;

    background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
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

  move(we_good = 1) {
    let mousePosition = createVector(mouseX, mouseY);
    let dx = mousePosition.x - this.position.x;
    let dy = mousePosition.y - this.position.y;
    let distanceSq = dx * dx + dy * dy;
    let distance = sqrt(distanceSq);

    if (distanceSq < radius*radius) {
      this.direction.set(dx, dy).normalize().mult(lineLength + distanceSq / (magDivisor*magDivisor));
    } else if (distance < outerRadius & we_good & interpolationRate > 0) {
      let targetDirection = createVector(dx, dy).normalize().mult(lineLength + distanceSq / (magDivisor*magDivisor));
      this.direction.lerp(targetDirection, interpolationRate);
    }
  }

  show() {
    stroke(lineColor[0], lineColor[1], lineColor[2]);
    strokeWeight(lineWidth);
    line(this.position.x, this.position.y, this.position.x + this.direction.x, this.position.y + this.direction.y);
  }
}
