class Shepherd {
  constructor(x, y, herd, ms, mf) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);

    this.maxspeed = ms || 8;
    this.maxforce = mf || 0.8;

    this.herd = herd;
    this.straySheep = [];
    this.target = createVector(300, 300);


    let inputSize = 6 + this.herd.sheep.length * 2; // x,y for each sheep
    this.brain = new NeuralNetwork(inputSize, 64, 2);

    this.brainTrainings = 0;

    this.strayDistance = shc.strayDistance;
    this.crouchDistance = shc.crouchDistance;
    this.driveDistance = shc.driveDistance;
    this.collectDistance = shc.collectDistance;
  }

  run() {
    // update from controls
    this.strayDistance = shc.strayDistance;
    this.crouchDistance = shc.crouchDistance;
    this.driveDistance = shc.driveDistance;
    this.collectDistance = shc.collectDistance;

    // initialize avoidFlock forces to always act on Shepherd
    // let avoidFlock = this.avoidFlock();

    // first, check if we should crouch
    // let tooClose = false;
    // let sheep = this.herd.sheep;

    // for (let i = 0; i < sheep.length; i++) {
    //   if (p5.Vector.dist(this.pos, sheep[i].pos) < this.crouchDistance) {
    //     tooClose = true;
    //     break;
    //   }
    // }
    //
    // if (tooClose) {
    //   this.crouch();
    // } else {

    this.findStraySheep(); // update this.straySheep array

    let steerForce = createVector(0, 0);

    if (this.straySheep.length > 0) {
      steerForce.add(this.collect(this.straySheep[0]));
    } else {
      let slowingForce = createVector(0, 0);
      // this if statement will avoid "gittering" still sheep -- if we are very
      // close to zero speed, don't bother with slowingForce
      if (this.vel.mag() > 0.01) {
        slowingForce = this.vel.copy();
        slowingForce.mult(-0.25);
        slowingForce.normalize();
      }
      steerForce.add(slowingForce);
    }

    this.think(steerForce);

    // } else {
    // steerForce.add(this.drive(this.herd, this.target));
    // }

    // this.applyForce(avoidFlock.mult(shc.avoidFlock));
    // }

    if (!sys.nnControl) {
      this.applyForce(steerForce);
    }



    this.update();
    // this.display();
  }


  think(correctVector) {
    let targetArray = [correctVector.x, correctVector.y];

    let inputArray = [];
    let gcm = this.herd.getGCM();

    // first input current position:
    inputArray.push(constrain(map(this.pos.x, 0, width, 0, 1), 0, 1));
    inputArray.push(constrain(map(this.pos.y, 0, height, 0, 1), 0, 1));

    // add current velocity
    inputArray.push(constrain(map(this.vel.x / this.maxspeed, -this.maxspeed, this.maxspeed, 0, 1), 0, 1));
    inputArray.push(constrain(map(this.vel.y / this.maxspeed, -this.maxspeed, this.maxspeed, 0, 1), 0, 1));

    // add target position:
    // inputArray.push(constrain(map(this.target.x, 0, width, 0, 1), 0, 1));
    // inputArray.push(constrain(map(this.target.y, 0, height, 0, 1), 0, 1));

    // if (sys.gcmInput == "relative") {
    //   let relativeGCM = p5.Vector.sub(gcm, this.pos);
    //   inputArray.push(constrain(map(gcm.x, 0, width, 0, 1), 0, 1));
    //   inputArray.push(constrain(map(gcm.y, 0, height, 0, 1), 0, 1));
    // } else if (sys.gcmInput == "absolute") {

    // add GCM position
    inputArray.push(constrain(map(gcm.x, 0, width, 0, 1), 0, 1));
    inputArray.push(constrain(map(gcm.y, 0, height, 0, 1), 0, 1));


    // add position of each sheep
    for (let i = 0; i < this.herd.sheep.length; i++) {
      inputArray.push(map(this.herd.sheep[i].pos.x, 0, width, 0, 1));
      inputArray.push(map(this.herd.sheep[i].pos.y, 0, height, 0, 1));
    }

    // add position of stray sheep number 0
    // inputArray.push(constrain(map(this.straySheep[0].pos.x, 0, width, 0, 1), 0, 1));
    // inputArray.push(constrain(map(this.straySheep[0].pos.y, 0, height, 0, 1), 0, 1));


    if (sys.nnControl) {
      this.applyForce(this.brain.predict(inputArray));
    } else {
      this.brain.train(inputArray, targetArray);
      this.brainTrainings++;
    }
  }


  // will keep shepherd outside of GCM of flock, thus avoid splitting flock into
  // multiple pieces -- currently just avoiding the GCM itself, but would be
  // better to implement obstacle avoidance around the flock...
  avoidFlock() {
    let gcm = herd.getGCM();
    return this.returnSeek(gcm).mult(-1); // force away from gcm
  }

  // finds all stray sheep and puts them in this.straySheep (if they aren't in
  // it already), then sorts this.straySheep by distance from this.pos
  findStraySheep() {
    // loop and find the sheep straying the farthest
    // finding current sheep could be some combination of
    // farthest from herd and closest to me

    let gcm = herd.getGCM();
    let sheep = this.herd.sheep;
    let strays = [];

    for (let i = 0; i < sheep.length; i++) {
      // let isStray = this.straySheep.includes(sheep[i]);
      let d = p5.Vector.dist(sheep[i].pos, gcm);
      // if (d > this.strayDistance && !isStray){
      //   // this.straySheep.push(sheep[i]);
      //
      // }
      if (d > this.strayDistance) {
        strays.push(sheep[i]);
      }
    }

    // sort all stray sheep by distance from shepherd -- with closest sheep
    // first in the list (as a sort of priority order to be used in collection)
    strays.sort((a, b) => {
      let d1 = p5.Vector.dist(a.pos, this.pos);
      let d2 = p5.Vector.dist(b.pos, this.pos);
      if (d1 < d2) {
        return -1;
      } else {
        return 1;
      }
    });

    this.straySheep = strays;
  }


  collect(straySheep) {
    let gcm = this.herd.getGCM();
    let dir = p5.Vector.sub(straySheep.pos, gcm);
    dir.normalize(); // make a unit vector
    dir.setMag(this.collectDistance); // set distance of unit vector
    let target = p5.Vector.add(straySheep.pos, dir);
    // this.seek(target);
    return this.returnSeek(target);
  }

  drive(herd, target) {
    let gcm = this.herd.getGCM();
    let dir = p5.Vector.sub(gcm, target); // dir from target to GCM
    dir.normalize();
    dir.setMag(this.driveDistance);
    let t = p5.Vector.add(gcm, dir);
    // this.seek(t);
    return this.returnSeek(t);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  returnSeek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  crouch() {
    this.vel.mult(0);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
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

  display() {
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