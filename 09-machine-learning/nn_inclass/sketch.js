let brain;

function setup() {
  createCanvas(400, 400);
  brain = new NeuralNetwork(3, 3, 2);

  let inputs = [1.0, 0.5, 0.2];
  let outputs = brain.predict(inputs);
  console.log(outputs);

  // correct answer:
  let targets = [0, 1];
  brain.train(inputs, targets);

  outputs = brain.predict(inputs);
  console.log(outputs);



  // if (outputs[1] > outputs[0]) {
  //   console.log('use white bg');
  // } else {
  //   console.log('use black bg');
  // }


}