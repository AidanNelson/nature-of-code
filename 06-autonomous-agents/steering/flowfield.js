class FlowField {
  constructor(r){
    this.resolution = r || 20;

    this.numCols = width/ this.resolution;
    this.numRows = height/ this.resolution;

    this.field = [];
    for (let i = 0; i < this.numCols; i++){
      this.field[i] = [];
    }
    this.init();
  }

  init(){
    let offset = 0.1;
    noiseSeed(random(100));
    for (let i = 0; i < this.numCols; i++){
      for (let j = 0; j < this.numRows; j++){
        let theta = map(noise(i*offset,j*offset,0),0,1,0,TWO_PI);
        this.field[i][j] = createVector(cos(theta),sin(theta),0);
      }
    }
  }

  lookup(pos){
    let col = floor(constrain(pos.x/this.resolution,0,this.numCols-1));
    let row = floor(constrain(pos.y/this.resolution,0,this.numRows-1));
    return this.field[col][row].copy(); // return a copy rather than orig
  }

  display(){
    let myScale = this.resolution - 5;
    for (let i = 0; i < this.numCols; i++){
      for (let j = 0; j < this.numRows; j++){
        let v = this.field[i][j];
        push();
        translate(i*this.resolution,j*this.resolution);
        stroke(255);
        rotate(v.heading());
        let len = v.mag() * myScale;
        line(0,0,len,0);
        pop();
      }
    }
  }
}
