let dog;
let herd;

let populations = [];

setupSliders();

function setup() {

  createCanvas(windowWidth, windowHeight - 50);

  for (let i = 0; i < 20; i++) {
    let c = color(random(50, 250), random(50, 250), random(50, 250));
    let shepherd = new Shepherd(c);
    populations.push(shepherd);
  }
}




let cyclesSinceLastGeneration = 0;
let cycles = 1;

function draw() {
  background(30);


  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i < populations.length; i++) {
      populations[i].run();
    }

    // next generation!
    if (cyclesSinceLastGeneration % 150 == 0) {
      nextGeneration();
      cyclesSinceLastGeneration = 0;
    }

    cyclesSinceLastGeneration++;
  }



  for (let i = 0; i < populations.length; i++) {
    populations[i].show();
  }
}



function nextGeneration() {
  populations.sort((a, b) => {
    if (a.fitness < b.fitness) {
      return -1;
    } else {
      return 1;
    }
  });

  let nextGeneration = [];
  let matingPool = [];

  let maxFitness = populations[0].fitness;
  let minFitness = populations[populations.length - 1].fitness;
  // console.log('max fitness:', maxFitness);
  let total = 0;
  for (let i = 0; i < populations.length; i++) {
    total += populations[i].fitness;
  }
  console.log('avg fitness:', total / populations.length);
  for (let i = 0; i < populations.length; i++) {
    let fitnessNormal = map(populations[i].fitness, 0, minFitness, 1, 0);
    // console.log(fitnessNormal);
    let n = floor(fitnessNormal * 10); // Arbitrary multiplier

    for (let j = 0; j < n; j++) {
      matingPool.push(populations[i]);
    }
  }



  for (let i = 0; i < populations.length; i++) {
    let parent = matingPool[floor(random(matingPool.length))];
    nextGeneration.push(parent.clone());
  }
  console.log('next generation!');
  populations = nextGeneration;
}