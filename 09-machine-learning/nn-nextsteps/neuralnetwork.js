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

  useDNA(dna) {
    this.weights_ih = dna[0];
    this.weights_ho = dna[1];

    this.bias_h = dna[2];
    this.bias_o = dna[3];
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