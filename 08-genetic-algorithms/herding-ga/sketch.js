let dogs = [];
let herds = [];
let isPaused = false;
let myFont;

setupSliders();

// trying to implement many separate 'pens' for unique shepherds:
let numCols = 3;
let numRows = 3;

let colW;
let rowH;


function setup() {
  createCanvas(windowWidth, windowHeight);

  colW = width / numCols;
  rowH = height / numRows;

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {


      let field = {
        x: i * colW,
        y: j * rowH,
        w: colW,
        h: rowH
      }

      let col = color(floor(random(255)), floor(random(255)), floor(random(255)));

      let herd = new Herd(30, field, col);
      let dog = new Shepherd(herd, field, col);

      herd.addDog(dog);

      herds.push(herd);
      dogs.push(dog);
    }
  }
}

function draw() {
  background(50);

  drawFields();
  // debugView();

  for (let d in dogs) {
    dogs[d].run();
  }

  for (let h in herds) {
    herds[h].run();
  }



}


function drawFields() {
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      noFill();
      rect(i * colW, j * rowH, colW, rowH);
      // let xLow = i * colW;
      // let xHigh = (i+1) * colW;
      // let yLow = this.field.y;
      // let yHigh = this.field.y + this.field.h;
      //
      // let b = 50;
      // line(b, b, width - b, b);
      // line(width - b, b, width - b, height - b);
      // line(b, height - b, width - b, height - b);
      // line(b, b, b, height - b);
      // pop();
    }
  }
}

function debugView() {
  let gcm = herd.getGCM();
  let strayDist = dog.strayDistance;
  let target = dog.target;

  push();
  fill(255, 0, 0);
  stroke(255);

  // herd gcm
  ellipse(gcm.x, gcm.y, 20, 20);

  // dog's stray distance
  noFill();
  ellipse(gcm.x, gcm.y, 2 * strayDist, 2 * strayDist);

  // target
  fill(0, 0, 255);
  ellipse(target.x, target.y, 25, 25);

  // set the dog's current #1 stray sheep to be red
  herd.resetColors();
  if (dog.straySheep[0]) dog.straySheep[0].currentColor = color(255, 0, 0);

  // borders
  let b = 50;
  line(b, b, width - b, b);
  line(width - b, b, width - b, height - b);
  line(b, height - b, width - b, height - b);
  line(b, b, b, height - b);
  pop();
}