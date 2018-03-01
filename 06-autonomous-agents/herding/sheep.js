
class Sheep{
  constructor(x,y,ms,mf){
    this.pos = createVector(x,y);
    this.vel = createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.acc = createVector(0,0);

    this.maxspeed = ms || 2;
    this.maxforce = mf || 0.4;

    this.currentColor = color(250,250,210);
    this.originalColor = color(250,250,210);
  }



  behaviors(herd, shepherd){
    // initialize all sheep forces
    // dynamic forces:
    let avoidShepherd = createVector(0,0);
    let graze = createVector(0,0);
    let cohesion = createVector(0,0);
    // constant forces:
    let separation = this.separate(herd);
    let stayWithinWalls = this.stayWithinWalls();


    // check if shepherd is not close by
    let d = p5.Vector.dist(this.pos,shepherd.pos);
    if (d > sc.detectionDistance){
      graze.add(this.graze());
    } else { // else if the threat is present
      let neighbors = this.findNearestNeighbors(sc.nNeighbors, herd);
      cohesion.add(this.cohere(neighbors,1000));
      avoidShepherd.add(this.seek(shepherd.pos).mult(-1));
    }

    // weight all forces before applying them
    graze.mult(1);
    separation.mult(sc.separation);
    avoidShepherd.mult(sc.avoidance);
    cohesion.mult(sc.cohesion);

    // apply all forces
    this.applyForce(graze);
    this.applyForce(separation);
    this.applyForce(avoidShepherd);
    this.applyForce(cohesion);
  }

  // returns n nearest other agents in an array
  findNearestNeighbors(n, herd){
    let neighborsDist = [];

    // put all other agents in an array with their distance from this sheep
    for (let i in herd){
      neighborsDist.push({
        sheep: herd[i],
        dist: p5.Vector.dist(this.pos,herd[i].pos) //do this w/o sqrt?
      });
    }

    // sort that array by distance from this sheep, closest coming first
    neighborsDist.sort(function(a, b) {
      if (a.dist < b.dist) {
        return -1;
      } else {
        return 1;
      }
    });


    // put 'n' closest sheep into an array and return that array
    let neighbors = [];
    // start at index 1 b/c 0 is this sheep (distance of 0 from itself)
    for (let i = 1; i < neighborsDist.length && i < n+1; i++){
      neighbors.push(neighborsDist[i].sheep);
    }
    return neighbors;
  }

  seek(target){
    let desired = p5.Vector.sub(target,this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired,this.vel);
    // steer.limit(this.maxforce);
    steer.normalize();
    return steer;
  }

  separate(herd){
    let personalSpace = 10;
    let steer = createVector(0,0);
    let count = 0;

    // loop through herd and find all sheep within personal space
    for (let i = 0; i < herd.length; i++){
      let d = p5.Vector.dist(this.pos,herd[i].pos);

      // for every sheep within personal space, find vector pointing away
      // from them and add to away vector
      if ((d>0) && (d < personalSpace)) {
        let away = p5.Vector.sub(this.pos,herd[i].pos);
        away.normalize();
        away.div(d);
        steer.add(away);
        count++;
      }
    }

    // get mean of steering forces away from sheep
    if (count>0){
      steer.div(count);
    }

    // if we have any steering force (AKA any sheep is within personal space),
    // return desired force
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.vel);
      steer.normalize();
      // steer.limit(this.maxforce);
    }
    return steer;
  }

  graze(){
    // slow down the sheep's velocity as it is no longer scared
    let slowingForce = this.vel.copy();
    slowingForce.mult(-0.03);
    slowingForce.normalize();

    // wander around (could be replaced with C Reynolds wander behavior)
    // returns a force that is either current velocity slowed down
    if (random(1)>0.99){
      let grazeForce = createVector(random(-0.5,0.5),random(-0.5,0.5));
      grazeForce.normalize();
      return grazeForce;
    } else {
      return slowingForce;
      // return createVector(0,0);
    }
  }

  // cohere with
  cohere(herd, d) {
    let dist = d;
    let sum = createVector(0,0);

    let count = 0;
    for (let i in herd){
      let d = p5.Vector.dist(this.pos,herd[i].pos);
      if ((d>0) && (d<dist)) {
        sum.add(herd[i].pos);
        count ++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // seek local center
    } else{
      return createVector(0,0); // no force
    }
  }


  applyForce(f){
    this.acc.add(f);
  }

  update(){
    // this.stayWithinWalls();
    // this.wrapAround();

    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  wrapAround() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
  }

  stayWithinWalls(){
    let border = 50;
    let desired = createVector(0,0);

    if (this.pos.x < border)  desired.add(this.maxspeed, 0);
    if (this.pos.y < border) desired.add(0,this.maxspeed);
    if (this.pos.x > width-border) desired.add(-this.maxspeed,0);
    if (this.pos.y > height-border) desired.add(0,-this.maxspeed);

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      // steer.limit(this.maxforce);
      // this.applyForce(steer);
      steer.normalize();
      return steer;
    } else {
      return createVector(0,0);
    }
  }

  display(){
    // Draw a triangle rotated in the direction of velocity
    // copied from example 01
    let theta = this.vel.heading() + PI / 2;
    let size = 5;
    push();
    fill(this.currentColor);
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
