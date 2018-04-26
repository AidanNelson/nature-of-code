class Sheep {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);

    this.maxspeed = 1;
    this.maxforce = 0.1;

    this.currentColor = col;
    this.originalColor = col;

    this.health = 1;

    this.diameter = 10;
    this.debugMode = false;
  }



  behaviors(herd, shepherd) {
    // initialize all sheep forces
    // dynamic forces:
    let avoidShepherd = createVector(0, 0);
    let graze = createVector(0, 0);
    let cohesion = createVector(0, 0);
    let alignment = createVector(0, 0);
    // constant forces:
    let separation = this.separate(herd);
    let stayWithinWalls = this.stayWithinWalls();



    // check if shepherd is not  close by
    let d = p5.Vector.dist(this.pos, shepherd.pos);
    if (d > sc.detectionDistance) {
      graze.add(this.graze());
    } else { // else if the threat is present
      let neighbors = this.findNearestNeighbors(sc.nNeighbors, herd);
      cohesion.add(this.cohere(neighbors, 1000));
      alignment.add(this.align(neighbors));
      avoidShepherd.add(this.seek(shepherd.pos).mult(-1));
    }

    if (this.debugMode) {
      console.log('avoidShepherd:', avoidShepherd.mag());
      console.log('graze:', graze.mag());
      console.log('cohesion:', cohesion.mag());
      console.log('separation:', separation.mag());
      console.log('stayWithinWalls:', stayWithinWalls.mag());
    }

    // weight all forces before applying them
    graze.mult(sc.graze);
    separation.mult(sc.separation);
    avoidShepherd.mult(sc.avoidance);
    cohesion.mult(sc.cohesion);
    stayWithinWalls.mult(sc.stayWithinWalls);
    alignment.mult(sc.alignment);

    if (this.debugMode) {
      console.log('avoidShepherd:', avoidShepherd.mag());
      console.log('graze:', graze.mag());
      console.log('cohesion:', cohesion.mag());
      console.log('separation:', separation.mag());
      console.log('stayWithinWalls:', stayWithinWalls.mag());
      this.debugMode = false;
    }

    // apply all weighted forces
    let forceArray = [];
    forceArray.push(graze);
    forceArray.push(stayWithinWalls);
    forceArray.push(separation);
    forceArray.push(avoidShepherd);
    forceArray.push(cohesion);
    forceArray.push(alignment);
    this.applyMultipleForces(forceArray);
  }

  // will apply a full list of weighted forces, limiting the sum to maxforce
  applyMultipleForces(forces) {
    let allForces = createVector(0, 0);
    for (let i in forces) {
      allForces.add(forces[i]);
    }
    allForces.limit(this.maxforce);
    this.applyForce(allForces);
  }


  // returns n nearest other agents in an array
  findNearestNeighbors(n, herd) {
    let neighborsDist = [];

    // put all other agents in an array with their distance from this sheep
    for (let i in herd) {
      neighborsDist.push({
        sheep: herd[i],
        dist: p5.Vector.dist(this.pos, herd[i].pos) //do this w/o sqrt?
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
    for (let i = 1; i < neighborsDist.length && i < n + 1; i++) {
      neighbors.push(neighborsDist[i].sheep);
    }
    return neighbors;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.vel);
    // steer.limit(this.maxforce);
    steer.normalize();
    return steer;
  }

  separate(herd) {
    let personalSpace = this.diameter;
    let steer = createVector(0, 0);
    let count = 0;

    // loop through herd and find all sheep within personal space
    for (let i = 0; i < herd.length; i++) {
      let d = p5.Vector.dist(this.pos, herd[i].pos);

      // for every sheep within personal space, find vector pointing away
      // from them and add to away vector
      if ((d > 0) && (d < personalSpace)) {
        let away = p5.Vector.sub(this.pos, herd[i].pos);
        away.normalize();
        away.div(d);
        steer.add(away);
        count++;
      }
    }

    // get mean of steering forces away from sheep
    if (count > 0) {
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

  // slow down the sheep's velocity as it is no longer scared
  graze() {

    // wander around (could be replaced with C Reynolds wander behavior)
    // returns a force that is either current velocity slowed down
    if (random(1) > 0.50) {
      let grazeForce = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
      grazeForce.setMag(50);
      return grazeForce;
    } else {
      let slowingForce = createVector(0, 0);
      // this if statement will avoid "gittering" still sheep -- if we are very
      // close to zero speed, don't bother with slowingForce
      if (this.vel.mag() > 0.01) {
        slowingForce = this.vel.copy();
        slowingForce.mult(-1);
        slowingForce.normalize();
      }
      return slowingForce;
    }
  }

  // cohere with
  cohere(herd, d) {
    let dist = d;
    let sum = createVector(0, 0);

    let count = 0;
    for (let i in herd) {
      let d = p5.Vector.dist(this.pos, herd[i].pos);
      if ((d > 0) && (d < dist)) {
        sum.add(herd[i].pos);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // seek local center
    } else {
      return createVector(0, 0); // no force
    }
  }

  align(herd) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < herd.length; i++) {
      let d = p5.Vector.dist(this.pos, herd[i].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(herd[i].vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count); // mean of neighbor velocities
      sum.normalize(); //unit vector
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.normalize();
      return steer;
    } else {
      return createVector(0, 0); // check against error
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.stayWithinWalls();
    // this.wrapAround();

    this.vel.add(this.acc);

    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // this.health -= 0.001;
  }

  isDead() {
    return this.health < 0;
  }

  wrapAround() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
  }

  stayWithinWalls() {
    let border = 50;
    let desired = createVector(0, 0);

    if (this.pos.x < border) desired.add(this.maxspeed, 0);
    if (this.pos.y < border) desired.add(0, this.maxspeed);
    if (this.pos.x > width - border) desired.add(-this.maxspeed, 0);
    if (this.pos.y > height - border) desired.add(0, -this.maxspeed);

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      // steer.limit(this.maxforce);
      // this.applyForce(steer);
      steer.normalize();
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    // copied from example 01
    let theta = this.vel.heading() + PI / 2;
    let size = 4;
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
    // ellipse(this.pos.x, this.pos.y,this.diameter,this.diameter);
  }
}