// toy neural network...https://www.youtube.com/watch?v=tlqinMNM4xs&index=18&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh


class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);

    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);

    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_rate = 0.1;
  }

  feedForward(input_matrix) {
    let hidden = Matrix.multiply(this.weights_ih, input_matrix);
    hidden.add(this.bias_h);
    // activation
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid)

    return output;
  }

  train(inputs, targets) {
    // feed forward:
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid); // activation function


    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid); // activation function

    //calculate output error
    let output_error = Matrix.subtract(targets, outputs);

    // calculate gradient at output
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_error); //elementwise
    gradients.multiply(this.learning_rate); //scalar


    // calculate deltas for weights
    let hidden_t = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_t);

    // change weights & biases
    this.weights_ho.add(weight_ho_deltas);
    this.bias_o.add(gradients);

    // Hidden layer:
    let weights_ho_t = Matrix.transpose(this.weights_ho);
    let hidden_error = Matrix.multiply(weights_ho_t, output_error);

    // calculate gradient:
    let hidden_gradients = Matrix.map(hidden, dsigmoid);
    hidden_gradients.multiply(hidden_error);
    hidden_gradients.multiply(this.learning_rate);

    // calculate deltas for weights
    let inputs_t = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t);

    // change weights & biases for hidden layer
    this.weights_ih.add(weight_ih_deltas);
    this.bias_h.add(hidden_gradients);

  }
}

function sigmoid(x) {
  return (1 / (1 + Math.exp(-x)));
}

function dsigmoid(y) {
  return (y * (1 - y)); // assumes y has already passed through sigmoid
}




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




window.onload = function() {

  let nn = new NeuralNetwork(2, 3, 1);

  // training XOR
  for (let i = 0; i < 50000; i++) {
    let index = Math.floor(Math.random() * 4);
    let inputs = Matrix.fromArray(xor_training_data[index].input);
    let targets = Matrix.fromArray(xor_training_data[index].target);

    nn.train(inputs, targets);
  }

  for (let i = 0; i < xor_training_data.length; i++) {
    let inputs = Matrix.fromArray(xor_training_data[i].input);
    console.table(inputs.matrix);
    let result = nn.feedForward(inputs);
    console.table(result.matrix);
  }
  // testMatrices();
}







function testMatrices() {
  let m1 = new Matrix(2, 1);
  let m2 = new Matrix(1, 2);

  m1.randomizeToTen();
  m2.randomizeToTen();

  console.log("M1:");
  console.table(m1.matrix);
  console.log("M2:");
  console.table(m2.matrix);

  console.log("M1 dot M2:");
  let out = m1.multiply(m2);
  console.table(out.matrix);

  console.log("TRANSPOSED:");
  let transposed = Matrix.transpose(out);
  console.table(transposed.matrix);

  console.log("ADDING 2:");
  transposed.add(2);
  console.table(transposed.matrix);

  // console.log("SUBTRACTING 5:");
  // transposed.subtract(5);
  // console.table(transposed.matrix);

  console.log("MAPPING A FUNCTION (MODULO 5):");

  function moduloFive(i) {
    return i % 5;
  }
  transposed.map(moduloFive);
  console.table(transposed.matrix);

  console.log("Static Matrix Multiplication");
  let output = Matrix.multiply(transposed, m1);
  console.table(output.matrix);
}