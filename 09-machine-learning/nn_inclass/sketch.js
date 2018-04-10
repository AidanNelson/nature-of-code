let brain;

let xor_training_data = [{
    input: [0, 1],
    target: [1]
  },
  {
    input: [1, 0],
    target: [1]
  },
  {
    input: [1, 1],
    target: [0]
  },
  {
    input: [0, 0],
    target: [0]
  }
];


function setup() {
  createCanvas(400, 400);
  brain = new NeuralNetwork(2, 2, 1);


  // training XOR
  for (let i = 0; i < 100000; i++) {
    let index = Math.floor(Math.random() * 4);
    let inputs = xor_training_data[index].input;
    let targets = xor_training_data[index].target;

    brain.train(inputs, targets);
  }

  for (let i = 0; i < xor_training_data.length; i++) {
    let inputs = xor_training_data[i].input;
    console.table(inputs);
    let result = brain.predict(inputs);
    console.log(result);
  }
}