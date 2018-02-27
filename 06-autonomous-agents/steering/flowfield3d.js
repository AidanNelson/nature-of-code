class FlowField3D {
  constructor(r){
    this.resolution = r || 40;

    let size = 200;

    this.numX = size/ this.resolution;
    this.numY = size/ this.resolution;
    this.numZ = size/ this.resolution;

    this.field = [];
    for (let i = 0; i < this.numX; i++){
      this.field[i] = [];
      for (let j = 0; j< this.numY; j++){
        this.field[i][j] = [];
      }
    }
    this.init();
  }

  init(){
    let offset = 0.1;
    noiseSeed(random(100));
    for (let i = 0; i < this.numX; i++){
      for (let j = 0; j < this.numY; j++){
        for (let z = 0; z < this.numZ; z++){
          let theta = map(noise(i*offset,j*offset,z*offset),0,1,0,TWO_PI);
          this.field[i][j][z] = createVector(cos(theta),sin(theta),cos(theta));
        }
      }
    }
  }

  lookup(pos){
    let col = floor(constrain(pos.x/this.resolution,0,this.numX-1));
    let row = floor(constrain(pos.y/this.resolution,0,this.numY-1));
    let zed = floor(constrain(pos.z/this.resolution,0,this.numZ-1));
    return this.field[col][row][zed].copy(); // return a copy rather than orig
  }

  display(){
    let myScale = this.resolution - 5;
    for (let i = 0; i < this.numX; i++){
      for (let j = 0; j < this.numY; j++){
        for (let z = 0; z < this.numZ; z++){
          let v = this.field[i][j][z];
          push();
          translate(i*this.resolution,j*this.resolution,z * this.resolution);
          // stroke(255);
          // rotateX(v.heading());
          // rotateY(v.heading());
          // rotateZ(v.heading());
          // let len = v.mag() * myScale;
          // line(0,0,len,0);
          sphere(2);
          pop();
        }
      }
    }
  }
}
