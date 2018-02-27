class Shepherd {
  constructor(x,y,herd,ms,mf){
    this.pos = createVector(x,y);
    this.vel = createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.acc = createVector(0,0);

    this.maxspeed = ms || 8;
    this.maxforce = mf || 0.8;

    this.stopDist = 10; // stop if closer than this
    // sheep may stray up to this amount before collecting behavior kicks in
    this.strayDistance = 100;

    this.target = createVector(300,300);

    this.herd = herd;
  }

  run(){
    let gcm = herd.getGCM();

    let sheep = this.herd.sheep;
    let driveSheep = true;

    for (let i = 0; i < sheep.length; i++){
      if (p5.Vector.dist(this.pos,sheep[i].pos) < this.stopDist){
        console.log("crouching");
        this.crouch();
        break;
      } else if (p5.Vector.dist(sheep[i].pos,gcm) > this.strayDistance){
        console.log("collecting stray sheep");
        this.collect(sheep[i]);
        driveSheep = false;
        break;
      }
    }

    if (driveSheep) {
      console.log("driving this.herd to target");
      this.drive(this.herd,this.target);
    }


    this.update();
    this.display();
  }

  collect(straySheep){
    let collectionDist = 30;
    let gcm = this.herd.getGCM();
    let dir = p5.Vector.sub(straySheep.pos,gcm);
    dir.normalize(); // make a unit vector
    dir.setMag(collectionDist); // set distance of unit vector
    let target = p5.Vector.add(straySheep.pos,dir);
    this.seek(target);
  }

  drive(herd,target){
    let driveDist = 50;
    let gcm = this.herd.getGCM();
    let dir = p5.Vector.sub(gcm,target); // dir from target to GCM
    dir.normalize();
    dir.setMag(driveDist);
    let t = p5.Vector.add(gcm,dir);
    this.seek(t);
  }

  // - if all sheep are within a certain distance from their global center of mass (GCM - center of flock), then shepherd will assume DRIVING position / Behavior

  // - if >0 sheep is > f(N) from GCM, then shepherd will assume COLLECTING position / behavior directly behind this sheep w/r/t GCM of flock

  seek(target){
    let desired = p5.Vector.sub(target,this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  crouch(){
    this.vel.mult(0);
  }

  applyForce(f){
    this.acc.add(f);
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // this.wrapAround();
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
    let size = 10;
    push();
    fill(255);
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
