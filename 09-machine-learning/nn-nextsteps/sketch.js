// window.onload = function() {
//
//
//   // training XOR
//   for (let i = 0; i < 50000; i++) {
//     let index = Math.floor(Math.random() * 4);
//     let inputs = Matrix.fromArray(xor_training_data[index].input);
//     let targets = Matrix.fromArray(xor_training_data[index].target);
//
//     nn.train(inputs, targets);
//   }
//
//   for (let i = 0; i < xor_training_data.length; i++) {
//     let inputs = Matrix.fromArray(xor_training_data[i].input);
//     console.table(inputs.matrix);
//     let result = nn.feedForward(inputs);
//     console.table(result.matrix);
//   }
//
// }





//////////////
let obstacles = [];
let population = [];

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < 5; i++) {
    let r = random(25, 50);
    obstacles.push(new Obstacle(random(width), random(height)));
  }

  population.push(new Boid(width / 2, height / 2, obstacles));
}

function draw() {
  background(200);

  for (let i in population) {
    population[i].update();
    population[i].display();

  }

  for (let i in obstacles) {
    obstacles[i].display();
  }

}