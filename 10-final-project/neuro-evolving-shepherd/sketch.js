let population = [];
let generationNumber = 0
let cyclesSinceLastGeneration = 0;

setupSliders();

function setup() {
  createCanvas(windowWidth - 50, windowHeight - 50);

  // create initial population
  for (let i = 0; i < sys.populationSize; i++) {
    let c = color(random(50, 250), random(50, 250), random(50, 250));
    let shepherd = new Shepherd(c);
    population.push(shepherd);
  }
}



function draw() {
  background(30);
  drawGenerationNumber();


  for (let c = 0; c < sys.simulationSpeed; c++) {
    for (let i = population.length - 1; i >= 0; i--) {
      population[i].run();
    }

    // next generation!
    if (cyclesSinceLastGeneration % sys.generationLength == 0) {
      nextGeneration();
      cyclesSinceLastGeneration = 0;
    }

    cyclesSinceLastGeneration++;
  }

  displayPopulation();
}


function drawGenerationNumber() {
  if (sys.debugMode) {
    textSize(22);
    textAlign(LEFT);
    fill(255);
    let info = 'generation:' + generationNumber;
    text(info, 25, 50);
  }
}

function displayPopulation() {
  for (let i = 0; i < population.length; i++) {
    population[i].show();
    // in debug mode, show gcm of herd of sheep under mouse
    if (sys.debugMode) {
      let p1 = population[i].pos;
      let p2 = population[i].herd.getGCM();
      stroke(255, 255, 255, 100);
      strokeWeight(1);
      line(p1.x, p1.y, p2.x, p2.y);
      // if (mouseIsPressed) {
      //   let d = dist(mouseX, mouseY, population[i].pos.x, population[i].pos.y);
      //   if (d < 30) {
      //     fill(255, 255, 255, 100);
      //     stroke(0);
      //     let gcm = population[i].herd.getGCM();
      //     ellipse(gcm.x, gcm.y, 30, 30);
      //   }
      // }
    }
  }
}

function nextGeneration() {
  generationNumber++;
  population.sort((a, b) => {
    if (a.fitness < b.fitness) {
      return -1;
    } else {
      return 1;
    }
  });

  let nextGeneration = [];
  let matingPool = [];

  let maxFitness = population[0].fitness;
  let minFitness = population[population.length - 1].fitness;

  // let total = 0;
  // for (let i = 0; i < population.length; i++) {
  //   total += population[i].fitness;
  // }
  // console.log('avg fitness:', total / population.length);

  for (let i = 0; i < population.length; i++) {
    let fitnessNormal = map(population[i].fitness, 0, minFitness, 1, 0);
    // console.log(fitnessNormal);
    let n = floor(fitnessNormal * 100); // Arbitrary multiplier

    for (let j = 0; j < n; j++) {
      matingPool.push(population[i]);
    }
  }



  for (let i = 0; i < sys.populationSize; i++) {
    let parent = matingPool[floor(random(matingPool.length))];
    nextGeneration.push(parent.clone());
  }
  console.log('Generation: ', generationNumber);
  population = nextGeneration;
}









// if (population.length < 20) {
//   for (let dog of population) {
//     // Every vehicle has a chance of cloning itself according to score
//     // Argument to "clone" is probability
//     let newDog = dog.maybeClone(0.1 * v.score / record);
//     // If there is a child
//     if (newDog != null) {
//       population.push(newDog);
//     }
//   }
// }