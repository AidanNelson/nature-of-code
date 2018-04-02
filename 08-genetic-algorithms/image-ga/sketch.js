// https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/

/*

I created a small program that keeps a string of DNA for polygon rendering.
The procedure of the program is quite simple:

Setup a random DNA string  (application start)

1. Copy the current DNA sequence and mutate it slightly
2. Use the new DNA to render polygons onto a canvas
3. Compare the canvas to the source image
4. If the new painting looks more like the source image than the previous painting did, then overwrite the current DNA with the new DNA
5. Repeat from 1
Now to the interesting part:

*/



let parent = [];
let parentFitness;

let numPolygons = 100;
let polyDimensions = 5;
let newPolyAlpha = 50;

let generation = 1;

let sourceImg;


function preload() {
  sourceImg = loadImage('girl.jpg');
}


function setup() {
  createCanvas(sourceImg.width, sourceImg.height);


  pixelDensity(1); // to make using pixels array easier later...

  for (let i = 0; i < numPolygons; i++) {

    let poly = {
      points: [],
      col: color(floor(random(255)), floor(random(255)), floor(random(255)), newPolyAlpha)
    };
    for (let i = 0; i < polyDimensions; i++) {
      poly.points.push({
        x: floor(random(width)),
        y: floor(random(height))
      })
    };


    parent.push(poly);
  }

  // draw for first time
  drawDNA(parent);
  parentFitness = fitness();
}

function draw() {
  let child = reproduce(parent);

  drawDNA(child);

  let childFitness = fitness();

  // lower fitness scores are better
  if (childFitness < parentFitness) {
    generation++;
    parent = child;
    parentFitness = childFitness;
  }

}

function drawDNA(dna) {
  clear();
  for (let i = 0; i < dna.length; i++) {
    fill(dna[i].col);
    noStroke();

    let pts = dna[i].points;

    beginShape();
    for (let w = 0; w < pts.length; w++) {
      vertex(pts[w].x, pts[w].y);
    }
    endShape(CLOSE);
  }
}

function fitness() {

  let fitness = 0;
  let step = 1;

  loadPixels();
  sourceImg.loadPixels();

  for (let yVal = 0; yVal < height; yVal += step) {
    for (let xVal = 0; xVal < width; xVal += step) {

      let idx = 4 * (yVal * width + xVal);
      // console.log(idx);
      let diffR = sourceImg.pixels[idx + 0] - pixels[idx + 0];
      let diffG = sourceImg.pixels[idx + 1] - pixels[idx + 1];
      let diffB = sourceImg.pixels[idx + 2] - pixels[idx + 2];
      let diffA = sourceImg.pixels[idx + 3] - pixels[idx + 3];

      fitness += diffR * diffR + diffG * diffG + diffB * diffB + diffA * diffA;
    }
  }
  return fitness;
}

function reproduce(dna) {
  let child = [];
  let morphRate = 0.001;

  for (let i = 0; i < dna.length; i++) {

    let newPoints = [];

    let pts = dna[i].points;
    for (let q = 0; q < pts.length; q++) {

      if (random(1) < morphRate) {
        newPoints.push({
          x: floor(random(width)),
          y: floor(random(height))
        });
      } else {
        newPoints.push({
          x: pts[q].x,
          y: pts[q].y
        });
      }
    }

    let newCol;
    if (random(1) < morphRate) {
      newCol = color(floor(random(255)), floor(random(255)), floor(random(255)), newPolyAlpha);
    } else {
      newCol = dna[i].col;
    }

    let poly = {
      points: newPoints,
      col: newCol
    }

    child.push(poly);
  }
  return child;
}