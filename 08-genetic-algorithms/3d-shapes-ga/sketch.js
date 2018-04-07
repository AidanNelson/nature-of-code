let spherePoints = [];
let radius = 50;

let parent = [];
let parentFitness;

let mutationRate = 0.01;

let generation = 1;

function preload() {
  makeSphere(radius);
}


function setup() {
  createCanvas(400, 400, WEBGL);


  for (let i = 0; i < spherePoints.length; i++) {
    let pnt = {
      x: random(-radius * 2, radius * 2),
      y: random(-radius * 2, radius * 2),
      z: random(-radius * 2, radius * 2)
    }
    parent.push(pnt);
  }

  parentFitness = fitness(parent);

}

// function mouseDragged() {
//   let pnt = {
//     x: random(-radius * 2, radius * 2),
//     y: random(-radius * 2, radius * 2),
//     z: random(-radius * 2, radius * 2)
//   }
//   parent.push(pnt);
// }


function draw() {
  background(0);
  // orbitControl();
  if (mouseIsPressed) {
    let pnt = {
      x: mouseX - width / 2,
      y: mouseY - width / 2,
      z: 0
    }
    parent.push(pnt);

  } else {
    parentFitness = fitness(parent);
    for (let i = 0; i < 80; i++) {
      let child = reproduce(parent, mutationRate);
      let childFitness = fitness(child);

      if (childFitness < parentFitness) {
        parent = child;
        parentFitness = childFitness;
        generation++;
      }
    }
  }

  drawPoints(parent);
}


function drawPoints(dna) {
  for (let i in dna) {
    let pnt = dna[i];
    push();
    normalMaterial();
    translate(pnt.x, pnt.y, pnt.z);
    sphere(2);
    pop();
  }
}

function reproduce(par, mr) {
  let child = [];
  for (let i = 0; i < par.length; i++) {
    if (random(1) < mr) {
      child.push({
        x: par[i].x + random(-5, 5),
        y: par[i].y + random(-5, 5),
        z: par[i].z + random(-5, 5)
      });
    } else {
      child.push(par[i]);
    }
  }
  return child;
}

function fitness(dna) {
  let perfect = spherePoints.length * radius;
  let distances = 0;
  let diffs = 0;

  for (let i = 0; i < dna.length; i++) {
    let pnt = dna[i];
    // optimize this to avoid dist sqrt....
    let d = dist(pnt.x, pnt.y, pnt.z, 0, 0, 0);
    let diff = radius - d;
    diffs += diff * diff;
    // distances += d;
  }
  // let diff = perfect - distances;
  // return diff * diff;
  return diffs;
}

function makeSphere(radius) {
  let step = 0.2;
  // beginShape();
  for (let t = 0; t < PI; t += step) {
    for (let p = 0; p < TWO_PI; p += step) {
      let pnt = polarToCartesian(radius, t, p);
      // vertex(pnt.x, pnt.y, pnt.z);
      // push();
      // normalMaterial();
      // translate(pnt.x, pnt.y, pnt.z);
      // sphere(2);
      // pop();
      spherePoints.push(pnt);
    }
  }
  // endShape(CLOSE);
}

function polarToCartesian(r, theta, phi) {
  let _x = r * sin(theta) * cos(phi);
  let _y = r * sin(theta) * sin(phi);
  let _z = r * cos(theta);

  return {
    x: _x,
    y: _y,
    z: _z
  };
}