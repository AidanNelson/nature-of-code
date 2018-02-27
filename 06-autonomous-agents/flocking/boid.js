
class Boid{
  constructor(position){
    this.pos = position.copy();
    this.vel = createVector(random(-1,1),random(-1,1));
    this.acc = createVector(0,0);
    this.maxforce = 0.2;
    this.maxspeed = 4;
  }

  flock(boids){
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);

    separation.mult(1);
    alignment.mult(0.6);
    cohesion.mult(0.7);

    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }


  update(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);

    this.wrapAround();

    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(f){
    this.acc.add(f);
  }

  seek(target){
    let desired = p5.Vector.sub(target,this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(this.maxforce);

    return steer;
  }

  arrive(target){
    let desired = p5.Vector.sub(target,this.pos);
    let d = desired.mag();
    if (d<100){
      // at less than 100 px distance, map up to maxspeed
      let m = map(d,0,100,0,this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  stayWithinWalls(d) {
    let desired = null;
    // off left
    if (this.pos.x < d){
      // maxspeed in right direction
      desired = createVector(this.maxspeed,this.vel.y);
    } else if (this.pos.x > width - d){ // off to the right
      // maxspeed in left direction
      desired = createVector(-this.maxspeed,this.vel.y);
    }
    // up down
    if (this.pos.y < d){
      desired = createVector(this.vel.x,this.maxspeed);
    } else if (this.pos.y > height - d){
      desired = createVector(this.vel.x, -this.maxspeed);
    }

    if (desired) {
      // make unit vector of desire
      desired.normalize();
      // maximize that unit vector
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired,this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  follow(field){
    let desired = field.lookup(this.pos);
    desired.mult(this.maxspeed);

    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  separate(boids){
    let personalSpace = 30;
    let steer = createVector(0,0);
    let count = 0;

    for (let i = 0; i < boids.length; i++){
      let d = p5.Vector.dist(this.pos,boids[i].pos);

      if ((d>0) && (d < personalSpace)) {
        let away = p5.Vector.sub(this.pos,boids[i].pos);
        away.normalize();
        away.div(d);
        steer.add(away);
        count++;
      }
    }

    if (count>0){
      steer.div(count); // get mean average of steering forces
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.vel);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  align(boids){
    let neighbordist = 50;
    let sum = createVector(0,0);
    let count = 0;

    for (let i = 0; i< boids.length; i++) {
      let d = p5.Vector.dist(this.pos,boids[i].pos);
      if ((d>0) && (d < neighbordist)) {
        sum.add(boids[i].vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count); // mean of neighbor velocities
      sum.normalize(); //unit vector
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum,this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else{
      return createVector(0,0); // check against error
    }
  }

  cohere(boids) {
    let neighbordist = 50;
    let sum = createVector(0,0);

    let count = 0;
    for (let i in boids){
      let d = p5.Vector.dist(this.pos,boids[i].pos);
      if ((d>0) && (d<neighbordist)) {
        sum.add(boids[i].pos);
        count ++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // seek local center
    } else{
      return createVector(0,0); // check against error
    }
  }

  wrapAround() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
  }



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
