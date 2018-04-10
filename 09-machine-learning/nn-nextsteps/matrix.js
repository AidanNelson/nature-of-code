class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];


    for (let r = 0; r < this.rows; r++) {
      this.matrix[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.matrix[r][c] = 0;
      }
    }
  }

  static fromArray(arr) {
    let output = new Matrix(arr.length, 1);
    for (let r = 0; r < arr.length; r++) {
      output.matrix[r][0] = arr[r];
    }
    return output;
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
      if (this.cols != m.cols || this.rows != m.rows) {
        console.log('non static multiply function');
        console.log("Columns/Rows of A/B must match!");
        return undefined;
      } else {
        // element-wise multiplication
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            this.matrix[r][c] *= m.matrix[r][c];
          }
        }
      }
    } else {
      // scalar multiplication
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] *= m;
        }
      }
    }
  }


  add(n) {
    if (n instanceof Matrix) {
      if (this.rows != n.rows || this.cols != n.cols) {
        console.log("Rows/Cols must Match");
      } else {
        // console.log("element wise addition");
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.matrix[i][j] += n.matrix[i][j];
          }
        }
      }
    } else {
      // console.log("scalar addition");
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.matrix[i][j] += n;
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
        let num = Math.random() * 2 - 1;
        if (num == 0) {
          num = Math.random() * 2 - 1;
        }
        this.matrix[i][j] = num; //-1 to 1
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