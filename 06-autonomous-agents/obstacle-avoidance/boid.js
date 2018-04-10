class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(0, 1), random(0, 1));
    this.acc = createVector(0, 0);
    this.maxforce = 0.1;
    this.maxavoidforce = 0.15;
    this.maxspeed = 2;
    this.ahead = createVector(-1, -1);
    this.ahead2 = createVector(-1, -1);
  }

  // https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-collision-avoidance--gamedev-7777
  // avoidObstacles(obstacles){
  //   // look ahead
  //   let visionScale = 100;
  //   let ahead = this.vel.copy();
  //   ahead.normalize();
  //   ahead.mult(visionScale);
  //   ahead.add(this.pos);
  //
  //   let ahead2 = this.vel.copy();
  //   ahead2.normalize();
  //   ahead2.mult(visionScale/2);
  //   ahead2.add(this.pos);
  //
  //   this.ahead = ahead.copy();
  //   this.ahead2 = ahead2.copy();
  //
  //   // check for collision
  //   let threats = [];
  //   for (let i in obstacles){
  //     let d = p5.Vector.dist(ahead,obstacles[i].pos);
  //     let d2 = p5.Vector.dist(ahead2,obstacles[i].pos);
  //
  //     let oRadius = obstacles[i].radius;
  //     // console.log("d: ",d,"/ orad:",oRadius);
  //     if (d < oRadius || d2 < oRadius){
  //       // console.log("d: ",d,"/ orad:",oRadius);
  //       let dist = Math.min(d,d2);
  //       threats.push({
  //         dist: dist,
  //         obstacle: obstacles[i]
  //       });
  //     }
  //   }
  //
  //   threats.sort((a,b) => {
  //     if (a.dist < b.dist){
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  //
  //   if (threats.length > 0) {
  //     // calculate avoidance force
  //     // avoidance_force = ahead - obstacle_center
  //     // avoidance_force = normalize(avoidance_force) * MAX_AVOID_FORCE
  //
  //     // let maxavoid(this.maxforce);
  //     let threat = threats[0].obstacle;
  //
  //     // console.log(threat);
  //     // basically hoping this code will find point at which ray from boid
  //     // first makes contact with obstacle
  //     let a = this.vel.copy();
  //     a.normalize();
  //
  //     for (let i = 0; i < 100; i++) {
  //       a.mult(1.05); // increase by 5% each time through loop
  //       let ac = a.copy();
  //       ac.add(this.pos);
  //       fill(255,0,0);
  //       ellipse(ac.x,ac.y,2,2);
  //       let d = p5.Vector.dist(ac,threat.pos);
  //       if (d < threat.radius) {
  //         console.log('found first point of contact');
  //         break;
  //       }
  //     }
  //
  //
  //     a.add(this.pos);
  //     let avoid = p5.Vector.sub(a,threat.pos);
  //     avoid.normalize();
  //     avoid.setMag(this.maxavoidforce);
  //     this.applyForce(avoid);
  //
  //     // avoid obstacles
  //   }


  // }

  avoidObstacles(obstacles) {
    let visionScale = this.vel.mag() * 50;
    let buffer = 5;
    // until start is the same as ahead...
    // increase it a bit in that Direction
    // check whether the point intersects the circle

    let threats = [];
    let dir = this.vel.copy();
    dir.normalize();

    // trace a ray out from boid and check for collisions at each step
    for (let i = 0; i < visionScale; i++) {

      let checkPoint = dir.copy();
      checkPoint.add(this.pos); // turn dir into position ahead of this boid

      fill(255, 0, 0);
      ellipse(checkPoint.x, checkPoint.y, 2, 2);

      for (let j = 0; j < obstacles.length; j++) {
        let d = p5.Vector.dist(checkPoint, obstacles[j].pos);
        if (d < obstacles[j].radius + buffer) {
          threats.push({
            threat: obstacles[j],
            dist: d,
            intersection: checkPoint
          })
          // console.log('found first point of contact');
          break;
        }
      }

      dir.mult(1.05); // increase by 5% each time through loop
    }

    threats.sort((a, b) => {
      if (a.dist < b.dist) {
        return -1;
      } else {
        return 1;
      }
    });
    // console.log(threats[0]);
    if (threats[0]) {
      let v = this.vel.copy();
      v.normalize();
      let cToI = p5.Vector.sub(threats[0].threat.pos, threats[0].intersection);
      if (cToI.x < 0 || cToI.y < 0) {
        v.rotate(-HALF_PI);
      } else {
        v.rotate(HALF_PI); // 90 degrees to the right
      }
      // v.add(threats[0].intersection);
      // console.log(threats[0].dist);
      let m = 0.01 * (100 - threats[0].dist);
      console.log(m);
      v.setMag(m);
      v.limit(this.maxavoidforce);
      this.applyForce(v);

      // let avoid = p5.Vector.sub(threats[0].intersection,threats[0].threat.pos);
      // avoid.normalize();
      // avoid.setMag(this.maxavoidforce);
      // this.applyForce(avoid);
    }
  }

  flock(boids) {
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


  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.wrapAround();

    this.acc.mult(0);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    // we would like to go as fast as possible toward the target
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < 100) {
      // at less than 100 px distance, map up to maxspeed
      let m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  stayWithinWalls(d) {
    let desired = null;
    // off left
    if (this.pos.x < d) {
      // maxspeed in right direction
      desired = createVector(this.maxspeed, this.vel.y);
    } else if (this.pos.x > width - d) { // off to the right
      // maxspeed in left direction
      desired = createVector(-this.maxspeed, this.vel.y);
    }
    // up down
    if (this.pos.y < d) {
      desired = createVector(this.vel.x, this.maxspeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.vel.x, -this.maxspeed);
    }

    if (desired) {
      // make unit vector of desire
      desired.normalize();
      // maximize that unit vector
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  follow(field) {
    let desired = field.lookup(this.pos);
    desired.mult(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  separate(boids) {
    let personalSpace = 30;
    let steer = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);

      if ((d > 0) && (d < personalSpace)) {
        let away = p5.Vector.sub(this.pos, boids[i].pos);
        away.normalize();
        away.div(d);
        steer.add(away);
        count++;
      }
    }

    if (count > 0) {
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

  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count); // mean of neighbor velocities
      sum.normalize(); //unit vector
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0); // check against error
    }
  }

  cohere(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);

    let count = 0;
    for (let i in boids) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].pos);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // seek local center
    } else {
      return createVector(0, 0); // check against error
    }
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
    let size = 5;
    push();
    fill(250, 250, 210);
    stroke(0);
    strokeWeight(1);
    // ellipse(this.pos.x,this.pos.y,25,25);
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape();
    vertex(0, -size * 2);
    vertex(-size, size * 2);
    vertex(size, size * 2);
    endShape(CLOSE);
    pop();

    fill(255, 0, 255);
    ellipse(this.ahead.x, this.ahead.y, 10, 10);
    ellipse(this.ahead2.x, this.ahead2.y, 5, 5);

  }
}