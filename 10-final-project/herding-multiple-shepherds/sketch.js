let dog;
let herd;

let dogs = [];
let isPaused = false;
let myFont;

let border = 50;
let target;

// let drivePoints = [];

setupSliders();




////////////////////////////////////////////////////////////////////////////////

function setup() {

  createCanvas(windowWidth, windowHeight - 50);

  target = createVector(random(border, width - border), random(border, height - border));

  herd = new Herd(80);
  for (let i = 0; i < 5; i++) {
    dogs.push(new Shepherd(10, 10, herd));
    dogs[i].myIndex = i;
    dogs[i].target = target;
  }

}



////////////////////////////////////////////////////////////////////////////////

function draw() {
  if (!isPaused) {
    background(30);

    drawText();
    debugView();
    // shepherdDrive();
    // console.log(drivePoints);

    for (let i in dogs) {
      dogs[i].run();
    }
    herd.run();

    // add to shepherd class?
    switchTargets();

    if (keyIsDown(83)) {
      let b = 50;
      herd.addSheep(random(b, width - b), random(b, height - b));
    }
  }
}




////////////////////////////////////////////////////////////////////////////////

function shepherdDrive() {
  let gcm = herd.getGCM();
  let dir = p5.Vector.sub(gcm, target); // dir from target to GCM
  dir.normalize();

  // set drive points
  drivePoints = [];
  let angleBetweenDrivePoints = PI / dogs.length; // 180 degrees / # of shepherds

  for (let i = 0; i < dogs.length; i++) {
    let pt = dir.copy();
    pt.rotate(-HALF_PI / 2);
    pt.rotate(i * angleBetweenDrivePoints);
    pt.setMag(shc.driveDistance);
    pt = p5.Vector.add(gcm, pt);
    drivePoints.push({
      point: pt,
      index: -1
    });
  }

  // let allDrivePointsOccupied = false;

  // while (!allDrivePointsOccupied) {
  allDrivePointsOccupied = true;

  for (let j in drivePoints) {
    // check if drive point is unoccupied
    // if (drivePoints[j].index == -1) {
    //   // console.log('false');
    //   allDrivePointsOccupied = false;
    // }

    // decide which unoccupied dog gets this point
    let record = 100000000;
    let closestIndex = -1;

    // find which dog (which doesn't already have point) is closest
    for (let i in dogs) {
      if (!dogs[i].hasPoint) {
        // console.log('dog doesnt have point');
        let d = p5.Vector.sub(dogs[i].pos, drivePoints[j].point);
        d = d.magSq();
        if (d < record) {
          record = d;
          closestIndex = i;
        }
      }
    }

    // if (closestIndex == -1) {
    //   console.log('bad!');
    //   console.log(drivePoints.length);
    //   console.log(dogs.length);
    // }
    // console.log('closest index for drivepoint ', j, ' is:', closestIndex);
    drivePoints[j].index = closestIndex;
    if (!closestIndex == -1) {
      dogs[closestIndex].hasPoint = true;
    }
  }
}


////////////////////////////////////////////////////////////////////////////////


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
  let d = p5.Vector.dist(dogs[0].target, gcm);
  if (d < 25) {
    target = createVector(random(border, width - border), random(border, height - border));
    for (let i = 0; i < dogs.length; i++) {
      dogs[i].target = target;
    }
  }
}





function mouseDragged() {
  herd.addSheep(mouseX, mouseY);
}

function mouseClicked() {
  if (keyIsDown(84)) { // "t"
    dog.target = createVector(mouseX, mouseY);
  }
}

function debugView() {
  let gcm = herd.getGCM();
  let strayDist = shc.strayDistance;
  // let target = dog.target;

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
  // if (dog.straySheep[0]) dog.straySheep[0].currentColor = color(255, 0, 0);

  // borders
  let b = 50;
  line(border, border, width - border, border);
  line(width - border, border, width - border, height - border);
  line(border, height - border, width - border, height - border);
  line(border, border, border, height - border);
  pop();
}