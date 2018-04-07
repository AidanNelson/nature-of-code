class Matrix {
  constructor(rows, cols) {
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


  static multiply(a, b) {
    if (a.cols != b.rows) {
      console.log("Columns of A must match rows of B!");
      return undefined;
    } else {
      let output = new Matrix(a.rows, b.cols);
      for (let r = 0; r < a.rows; r++) {
        for (let c = 0; c < b.cols; c++) {
          let dotProduct = 0;
          for (let z = 0; z < a.cols; z++) {
            dotProduct += a.matrix[r][z] * b.matrix[z][c];
          }
          output.matrix[r][c] = dotProduct;
        }
      }
      return output;
    }
  }

  multiply(m) {
    if (m instanceof Matrix) {
      if (this.cols != m.rows) {
        console.log('non static multiply function');
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


  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] += n.matrix[i][j];
        }
      }
    } else {
      console.log("scalar addition");
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] += n;
        }
      }
    }
  }

  subtract(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          // console.log(this.matrix[i][j]);
          this.matrix[i][j] -= n.matrix[i][j];
          // console.log(this.matrix[i][j]);
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

  static subtract(a, b) {
    let result = new Matrix(a.rows, a.cols);

    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.rows == b.rows && a.cols == b.cols) {

        for (let i = 0; i < a.rows; i++) {
          for (let j = 0; j < a.cols; j++) {
            result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
          }
        }

      } else {
        console.log("Matrices must match in size!");
      }
    } else {
      console.log("Arguments must be Matrices!");
    }

    return result;
  }


  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random() * 2 - 1; //-1 to 1
      }
    }
  }

  // for easier testing / debugging
  randomizeToTen() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.floor(Math.random() * 10); //-1 to 1
      }
    }
  }

  static transpose(input) {
    let result = new Matrix(input.cols, input.rows);

    for (let r = 0; r < input.rows; r++) {
      for (let c = 0; c < input.cols; c++) {
        result.matrix[c][r] = input.matrix[r][c];
      }
    }
    return result;
  }

  static map(m, func) {
    let result = new Matrix(m.rows, m.cols);
    for (let r = 0; r < m.rows; r++) {
      for (let c = 0; c < m.cols; c++) {
        let val = m.matrix[r][c];
        result.matrix[r][c] = func(val);
      }
    }
    return result;
  }

  map(func) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let val = this.matrix[r][c];
        this.matrix[r][c] = func(val);
      }
    }
  }


}