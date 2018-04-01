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
let newPolyAlpha = 50;

let generations = [];
let generation = 1;

let sourceImg;

let pg;


function preload() {
  sourceImg = loadImage('girl.jpg');
}


function setup() {
  let canvas = createCanvas(sourceImg.width, sourceImg.height);
  canvas.id('canvas');

  pg = createGraphics(sourceImg.width, sourceImg.height);
  pg.pixelDensity(1);

  pixelDensity(1); // to make using pixels array easier later...

  for (let i = 0; i < 100; i++) {

    let poly = {
      points: [{
          x: floor(random(width)),
          y: floor(random(height))
        },
        {
          x: floor(random(width)),
          y: floor(random(height))
        },
        {
          x: floor(random(width)),
          y: floor(random(height))
        }
      ],
      col: color(floor(random(255)), floor(random(255)), floor(random(255)), newPolyAlpha)
    };

    parent.push(poly);
  }
  generations.push(parent);

  // draw for first time
  drawDNA(parent);
  parentFitness = fitness();
}

function draw() {
  for (let i = 0; i < 10; i++) {
    let child = reproduce(parent);
    drawDNA(child);

    let childFitness = fitness(10);

    // lower fitness scores are better
    if (childFitness < parentFitness) {
      generations.push(child);
      generation++;
      parent = child;
      parentFitness = childFitness;
    }
  }

  // if (generation % 10 === 0) {
  clear();
  image(pg, 0, 0, width, height);
  // }
}

function drawDNA(dna) {
  pg.clear();
  for (let i = 0; i < dna.length; i++) {
    pg.fill(dna[i].col);
    // fill(0);
    pg.noStroke();
    let pts = dna[i].points;
    pg.triangle(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y);
  }
}

function fitness() {

  let fitness = 0;
  let step = 1;

  pg.loadPixels();
  sourceImg.loadPixels();

  for (let yVal = 0; yVal < height; yVal += step) {
    for (let xVal = 0; xVal < width; xVal += step) {

      let idx = 4 * (yVal * width + xVal);
      // console.log(idx);
      let diffR = sourceImg.pixels[idx + 0] - pg.pixels[idx + 0];
      let diffG = sourceImg.pixels[idx + 1] - pg.pixels[idx + 1];
      let diffB = sourceImg.pixels[idx + 2] - pg.pixels[idx + 2];
      let diffA = sourceImg.pixels[idx + 3] - pg.pixels[idx + 3];

      fitness += diffR * diffR + diffG * diffG + diffB * diffB + diffA * diffA;
    }
  }
  return fitness;
}

function reproduce(dna) {
  let child = [];
  let morphRate = 0.005;

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


// function drawGenerations() {
//   noLoop();
//   document.getElementById('canvas').remove();
//   let canvas = createCanvas(1000, 1000);
//
//   let step = generations.length / 10;
//
//   // let colW = 1000/step;
//   // let colH = 1000/step;
//
//   let count = 0;
//   for (let y = 0; y < 1000; y += 100) {
//     for (let x = 0; x < 1000; x += 100) {
//       if (count < generations.length) {
//         let gen = generations[count];
//         console.log(gen);
//         let pg = createGraphics(400, 400);
//         drawDNAonG(gen, pg);
//         image(pg, x * 100, y * 100, 100, 100);
//         count += 1;
//       }
//     }
//   }
// }
//
//
//
// function drawDNAonG(dna, graphicsElement) {
//   graphicsElement.clear();
//   for (let i = 0; i < dna.length; i++) {
//     graphicsElement.fill(dna[i].col);
//     graphicsElement.noStroke();
//     let pts = dna[i].points;
//     graphicsElement.triangle(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y);
//   }
// }