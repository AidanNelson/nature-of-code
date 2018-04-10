class Obstacle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 50;
  }
  display() {
    stroke(255);
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 2 * this.radius, 2 * this.radius);
  }
}


class Boid {
  constructor(x, y, obstacles) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(1, 2), random(1, 2));
    this.acc = createVector(0, 0);

    this.maxforce = 0.1;
    this.maxavoidforce = 0.15;
    this.maxspeed = 2;
    this.fitness = 0;

    this.ppos = this.pos.copy();

    this.brain = new NeuralNetwork(3, 2, 1);
    this.obstacles = obstacles;
    this.visionInputs = [1000, 1000, 1000]; // left, front, right

    for (let i = 0; i < 50000; i++) {
      let inputs = Matrix.fromArray(this.visionInputs);
      let targets = Matrix.fromArray([0.5]);

      this.brain.train(inputs, targets);
    }
  }

  rayTrace(obstacles) {
    // let visionScale = this.vel.mag() * 50;
    // until start is the same as ahead...
    // increase it a bit in that Direction
    // check whether the point intersects the circle

    let inputFront = 1000;
    let inputRight = 1000;
    let inputLeft = 1000;

    let spread = PI / 12;

    let radius = 50;

    let dir = this.vel.copy();
    dir.normalize();

    // trace a ray out from boid and check for collisions at each step
    // for (let i = 0; i < visionScale; i++) {
    while (dir.mag() < 150) {
      // console.log('ok');
      let checkPointFront = dir.copy();
      checkPointFront.add(this.pos); // turn dir into position ahead of this boid

      fill(255, 0, 0);
      ellipse(checkPointFront.x, checkPointFront.y, 2, 2);
      // console.log(checkPointFront);
      // find nearest obstacle in front
      for (let j = 0; j < this.obstacles.length; j++) {

        let d = p5.Vector.dist(checkPointFront, this.obstacles[j].pos);

        if (d < radius) {
          let d2 = p5.Vector.dist(this.pos, checkPointFront);
          inputFront = d2;
        }
      }



      let checkPointLeft = dir.copy();
      checkPointLeft.rotate(-spread);
      checkPointLeft.add(this.pos); // turn dir into position ahead of this boid

      fill(255, 0, 0);
      ellipse(checkPointLeft.x, checkPointLeft.y, 2, 2);

      // find nearest obstacle to left
      for (let j = 0; j < this.obstacles.length; j++) {
        let d = p5.Vector.dist(checkPointLeft, this.obstacles[j].pos);
        if (d < radius) {
          let d2 = p5.Vector.dist(this.pos, checkPointLeft);
          inputLeft = d2;
        }
      }

      let checkPointRight = dir.copy();
      checkPointRight.rotate(spread);
      checkPointRight.add(this.pos); // turn dir into position ahead of this boid

      fill(255, 0, 0);
      ellipse(checkPointRight.x, checkPointRight.y, 2, 2);

      // find nearest obstacle in front
      for (let j = 0; j < this.obstacles.length; j++) {
        let d = p5.Vector.dist(checkPointRight, this.obstacles[j].pos);
        if (d < radius) {
          let d2 = p5.Vector.dist(this.pos, checkPointRight);
          inputRight = d2;
        }
      }

      dir.mult(1.05); // increase by 5% each time through loop
    }
    this.visionInputs = [inputLeft, inputFront, inputRight];

    for (let i = 0; i < this.visionInputs.length; i++) {
      if (this.visionInputs[i] < 1000) {
        // console.log("wow!  close call!");
        // console.log(this.visionInputs);
      }
    };
  }

  think() {
    let inputs = Matrix.fromArray(this.visionInputs);
    let guess = this.brain.feedForward(inputs);
    console.log(guess);
    guess.matrix[0][0] -= 1.0;

    // get heading
    let turn = this.vel.copy();
    turn.normalize();
    // turn.rotate(PI / 4); // rotate 90 degrees to the right
    if (guess.matrix[0][0] < 0) {
      turn.rotate(-PI / 4);
    } else {
      turn.rotate(PI / 4);
    }
    turn.setMag(guess.matrix[0][0] / 100);
    // turn.limit(this.maxspeed);


    this.applyForce(turn);

  }

  isHit() {
    for (let i in this.obstacles) {
      let d = p5.Vector.dist(this.pos, this.obstacles[i].pos);
      if (d < 50) {
        return true;
        break;
      }
    }
    return false;
  }


  update() {


    this.think();
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);

    this.rayTrace();
    this.pos.add(this.vel);
    this.fitness += p5.Vector.dist(this.pos, this.ppos);
    this.wrapAround();

    this.acc.mult(0);
    this.ppos = this.pos.copy();
  }

  applyForce(f) {
    this.acc.add(f);
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



  }
}