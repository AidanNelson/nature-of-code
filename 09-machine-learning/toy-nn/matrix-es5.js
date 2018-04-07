function Matrix(rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.matrix = [];


  for (let i = 0; i < this.rows; i++) {
    this.matrix[i] = [];
    for (let j = 0; j < this.cols; j++) {
      this.matrix[i][j] = 0;
    }
  }
}

Matrix.prototype.multiply = function(m) {
  if (m instanceof Matrix) {
    if (this.cols != m.rows) {
      console.log("Columns of A must match rows of B!");
      return undefined;
    } else {
      let output = new Matrix(this.rows, m.cols);
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < m.cols; c++) {
          let dotProduct = 0;
          for (let z = 0; z < this.cols; z++) {
            dotProduct += this.matrix[r][z] * m.matrix[z][c];
          }
          output.matrix[r][c] = dotProduct;
        }
      }
      return output;
    }
  } else {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] *= m;
      }
    }
  }
}

Matrix.prototype.add = function(n) {
  if (n instanceof Matrix) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] += n.matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] += n;
      }
    }
  }
}

Matrix.prototype.subtract = function(n) {
  if (n instanceof Matrix) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        console.log(this.matrix[i][j]);
        this.matrix[i][j] -= n.matrix[i][j];
        console.log(this.matrix[i][j]);
      }
    }
  } else {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] -= n;
      }
    }
  }
}


Matrix.prototype.randomize = function() {
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.cols; j++) {
      this.matrix[i][j] = Math.random() * 2 - 1;
    }
  }
}

Matrix.prototype.transpose = function() {
  let result = new Matrix(this.cols, this.rows);


  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      result.matrix[c][r] = this.matrix[r][c];
    }
  }

  return result;
}

Matrix.prototype.map = function(func) {
  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      let val = this.matrix[r][c];
      this.matrix[r][c] = func(val);
    }
  }
}