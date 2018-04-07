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

    this.learning_rate = 0.05;
  }

  feedForward(input_matrix) {

    let hidden = this.weights_ih.multiply(input_matrix);
    hidden.add(this.bias_h);
    // activation
    hidden.map(sigmoid);

    let output = this.weights_ho.multiply(hidden);
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



    //calculate error
    let output_error = Matrix.subtract(targets, outputs);


    // calculate gradient:
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_error);
    gradients.multiply(this.learning_rate);


    // calculate deltas for weights
    let hidden_t = Matrix.transpose(hidden);

    console.table(gradients.matrix);
    console.table(hidden_t.matrix);

    let weight_ho_deltas = Matrix.multiply(gradients, hidden_t);

    // change weights
    this.weights_ho.add(weight_ho_deltas);

    //HIDDEN:
    let weights_ho_t = Matrix.transpose(this.weights_ho);
    let hidden_error = weights_ho_t.multiply(output_error);

    // calculate gradient:
    let hidden_gradients = Matrix.map(hidden, dsigmoid);
    hidden_gradients.multiply(hidden_error);
    hidden_gradients.multiply(this.learning_rate);

    // calculate deltas for weights
    let inputs_t = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t);

    // change weights
    this.weights_ih.add(weight_ih_deltas);
  }

}

function sigmoid(x) {
  return 1 / (1 + Math.exp(x))
}

function dsigmoid(y) {
  return y * (1 - y); // assumes y has already passed through sigmoid
}









window.onload = function() {

  let nn = new NeuralNetwork(3, 2, 2);

  let inputs = new Matrix(3, 1);
  let targets = new Matrix(2, 1);

  targets.randomize();
  inputs.randomize();


  nn.train(inputs, targets);

  // testMatrices();
}







function testMatrices() {
  let m1 = new Matrix(2, 1);
  let m2 = new Matrix(1, 2);

  m1.randomizeToTen();
  m2.randomizeToTen();

  console.table(m1.matrix);
  console.table(m2.matrix);

  console.log("M1 dot M2:");
  let out = m1.multiply(m2);
  console.table(out.matrix);

  console.log("TRANSPOSE:");
  let transposed = Matrix.transpose(out);
  console.table(transposed.matrix);

  console.log("ADDING 2:");
  transposed.add(2);
  console.table(transposed.matrix);

  console.log("SUBTRACTING 5:");
  transposed.subtract(5);
  console.table(transposed.matrix);

  console.log("MAPPING A FUNCTION (MODULO 5):");

  function moduloFive(i) {
    return i % 5;
  }
  transposed.map(moduloFive);
  console.table(transposed.matrix);
}