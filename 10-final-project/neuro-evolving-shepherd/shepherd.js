function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}



class Shepherd {
  constructor(col, brain) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.maxspeed = 2;
    this.maxforce = 0.1;

    this.fitness = -1;

    this.health = 1;
    this.score = 0;

    this.col = col;
    this.herd = new Herd(1, this.col, this); // herd of 1 sheep

    let inputSize = this.herd.sheep.length * 2; // x,y for each sheep

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(6, 32, 2);
    }
  }


  run() {
    this.think();
    this.update();
    // this.display();

    this.herd.run(this);

    this.health -= 0.005;

    this.fitness = this.getFitness();

    // let gcm = this.herd.getGCM();
    // let d = p5.Vector.dist(this.pos, gcm);
    // if (d < 100) {
    //   this.score++;
    //   this.health + 1;
    // }
  }

  show() {
    this.display();
    this.herd.show();
  }

  isDead() {
    return this.health < 0;
  }

  clone() {
    let newBrain = this.brain.copy();
    newBrain.mutate(mutate);
    let c = color(random(50, 250), random(50, 250), random(50, 250));
    return new Shepherd(c, newBrain);
  }

  // Make a copy of this vehicle according to probability
  maybeClone(prob) {
    // Pick a random number
    let r = random(1);
    if (r < prob) {
      // New vehicle with brain copy
      return new Vehicle(this.brain);
    }
    // otherwise will return undefined
  }

  getFitness() {
    let gcm = this.herd.getGCM();
    // // console.log('gcm:', gcm);
    // let totalDist = 0;
    //
    // for (let i = 0; i < this.herd.sheep.length; i++) {
    //   let d = p5.Vector.dist(this.herd.sheep[i].pos, gcm);
    //   // console.log('dist:', d);
    //   totalDist += d;
    // }
    // return totalDist;
    return p5.Vector.dist(this.pos, gcm);
  }

  think() {
    let inputArray = [];
    let gcm = this.herd.getGCM();

    // for (let i = 0; i < this.herd.sheep.length; i++) {
    //   inputArray.push(map(this.herd.sheep[i].pos.x, 0, width, 0, 1));
    //   inputArray.push(map(this.herd.sheep[i].pos.y, 0, height, 0, 1));
    // }

    inputArray.push(constrain(map(this.pos.x, 0, width, 0, 1), 0, 1));
    inputArray.push(constrain(map(this.pos.y, 0, height, 0, 1), 0, 1));

    inputArray.push(this.vel.x / this.maxspeed);
    inputArray.push(this.vel.y / this.maxspeed);

    inputArray.push(constrain(map(gcm.x, 0, width, 0, 1), 0, 1));
    inputArray.push(constrain(map(gcm.y, 0, height, 0, 1), 0, 1));

    let outputs = this.brain.predict(inputArray);

    let desired = createVector(2 * outputs[0] - 1, 2 * outputs[1] - 1);
    desired.mult(this.maxspeed);
    // Craig Reynolds steering formula
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    // Apply the force
    this.applyForce(steer);

  }


  applyForce(f) {
    this.acc.add(f);
    this.acc.limit(this.maxforce);
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
    let size = 8;
    push();
    fill(this.col);
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