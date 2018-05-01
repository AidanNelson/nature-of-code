let dog;
let herd;

let dogs = [];
let isPaused = false;
let myFont;

setupSliders();

function setup() {

  createCanvas(windowWidth, windowHeight - 50);

  herd = new Herd(8);
  dog = new Shepherd(10, 10, herd);
  dogs.push(dog);
}


let cycles = 1000;

function draw() {
  if (!isPaused) {
    background(30);

    // drawText();
    // debugView();

    for (let i = 0; i < cycles; i++) {

      dog.run();
      herd.run();

    }
    // add to shepherd class?
    // switchTargets();

    // if (keyIsDown(83)) {
    //   let b = 50;
    //   herd.addSheep(random(b, width - b), random(b, height - b));
    // }
  }

  dog.display();
  herd.display();
}

function drawText() {
  let instructions = "Shift-click and drag to add sheep.  Press 'h' to see controls."
  textAlign(CENTER);
  textSize(24);
  fill(255);
  text(instructions, width / 2, 30);
  let explanation = "Red circle is center of flock. Blue circle is where dog wants sheep to go."
  text(explanation, width / 2, height - 20);
}

function switchTargets() {
  let gcm = herd.getGCM()
  let d = p5.Vector.dist(dog.target, gcm);
  if (d < 10) {
    let b = 50;
    dog.target = createVector(random(b, width - b), random(b, height - b));
  }
}





// function mouseDragged() {
//   if (keyIsPressed) { // spacebar
//     herd.addSheep(mouseX, mouseY);
//   } else {
//     dog.pos = createVector(mouseX, mouseY);
//   }
// }

// function mouseClicked() {
//   if (keyIsDown(84)) { // "t"
//     dog.target = createVector(mouseX, mouseY);
//   }
// }

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
  // fill(0, 0, 255);
  // ellipse(target.x, target.y, 25, 25);

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