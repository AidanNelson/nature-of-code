
class Vehicle3D{
  constructor(position, mass){
    this.pos = position.copy();
    this.vel = createVector(0,0,0);
    this.acc = createVector(0,0,0);
    this.maxforce = 0.4;
    this.maxspeed = 8;
    this.mass = mass || 1;
    // a cube for boundaries around center
    this.boundaries = {
      x: 400,
      y: 400,
      z: 400
    }
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);

    // this.wrapAround();

    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(f){
    this.acc.add(f);
  }

  // seek(target){
  //   let desired = p5.Vector.sub(target,this.pos);
  //   // we would like to go as fast as possible toward the target
  //   desired.setMag(this.maxspeed);
  //
  //   let steer = p5.Vector.sub(desired,this.vel);
  //   steer.limit(this.maxforce);
  //
  //   this.applyForce(steer);
  // }

  // arrive(target){
  //   let desired = p5.Vector.sub(target,this.pos);
  //   let d = desired.mag();
  //   if (d<100){
  //     // at less than 100 px distance, map up to maxspeed
  //     let m = map(d,0,100,0,this.maxspeed);
  //     desired.setMag(m);
  //   } else {
  //     desired.setMag(this.maxspeed);
  //   }
  //
  //   let steer = p5.Vector.sub(desired,this.vel);
  //   steer.limit(this.maxforce);
  //   this.applyForce(steer);
  // }

  // stayWithinWalls(d) {
  //   let desired = null;
  //   // off left
  //   if (this.pos.x < d){
  //     // maxspeed in right direction
  //     desired = createVector(this.maxspeed,this.vel.y);
  //   } else if (this.pos.x > width - d){ // off to the right
  //     // maxspeed in left direction
  //     desired = createVector(-this.maxspeed,this.vel.y);
  //   }
  //   // up down
  //   if (this.pos.y < d){
  //     desired = createVector(this.vel.x,this.maxspeed);
  //   } else if (this.pos.y > height - d){
  //     desired = createVector(this.vel.x, -this.maxspeed);
  //   }
  //
  //   if (desired) {
  //     // make unit vector of desire
  //     desired.normalize();
  //     // maximize that unit vector
  //     desired.mult(this.maxspeed);
  //     let steer = p5.Vector.sub(desired,this.vel);
  //     steer.limit(this.maxforce);
  //     this.applyForce(steer);
  //   }
  // }
  //
  // follow(field){
  //   let desired = field.lookup(this.pos);
  //   desired.mult(this.maxspeed);
  //
  //   let steer = p5.Vector.sub(desired,this.vel);
  //   steer.limit(this.maxforce);
  //
  //   this.applyForce(steer);
  // }

  // wrapAround() {
  //   if (this.pos.x < 0) this.pos.x = width;
  //   if (this.pos.y < 0) this.pos.y = height;
  //   if (this.pos.x > width) this.pos.x = 0;
  //   if (this.pos.y > height) this.pos.y = 0;
  // }



  display(){
    // Draw a triangle rotated in the direction of velocity
    // copied from example 01
    let theta = this.vel.heading() + PI / 2;
    let size = 5;
    push();
    fill(250,250,210);
    stroke(0);
    strokeWeight(1);
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape();
    vertex(0, -size * 2);
    vertex(-size, size * 2);
    vertex(size, size * 2);
    endShape(CLOSE);
    pop();
  }
}
