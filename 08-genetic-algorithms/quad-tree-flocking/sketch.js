// following along with.... https://www.youtube.com/watch?v=OJxEcs0w_kE

// let boids = [];
let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowWidth);

  for (let i = 0; i < 1000; i++) {
    bubbles.push(new Bubble());
  }




  // for (let i = 0; i < 10; i++) {
  //   boids.push(new Boid(createVector(width / 2, height / 2)));
  // }

  // for (let i = 0; i < 300; i++) {
  //   let p = new Point(randomGaussian(width / 2, width / 8), randomGaussian(height / 2, height / 8));
  //   noStroke();
  //   fill(255);
  //   ellipse(p.x, p.y, 1, 1);
  //   myPoints.push(p);
  //   qt.insert(p);
  // }

}

function draw() {
  let boundary = new Rectangle(width / 2, height / 2, width, height);
  let qt = new QuadTree(boundary, 4);
  // qt.display();


  clear();
  for (let i = 0; i < bubbles.length; i++) {
    let b = bubbles[i];
    qt.insert(b);
  }

  for (let i = 0; i < bubbles.length; i++) {
    let b = bubbles[i];

    let range = new Rectangle(b.x, b.y, 15, 15);
    let others = qt.query(range);

    b.move();
    b.update();

    let intersects = false;

    if (others) {
      for (let i = 0; i < others.length; i++) {
        let other = others[i];
        if (!(other == b)) {
          if (b.intersects(other)) {
            intersects = true;
          }
        }
      }
      if (intersects) {
        fill(255, 100, 220);
      } else {
        fill(0);
      }
      let r = b.r;
      ellipse(b.x, b.y, r, r);
    }
  }
}


//   b.move();
//   b.update();
//
//   let intersects = false;
//   for (let i = 0; i < bubbles.length; i++) {
//     let other = bubbles[i];
//     if (!(other == b)) {
//       if (b.intersects(other)) {
//         intersects = true;
//       }
//     }
//   }
//   if (intersects) {
//     fill(255, 100, 220);
//   } else {
//     fill(0);
//   }
//   let r = b.r;
//   ellipse(b.x, b.y, r, r);
// }


//
//
// for (let i in boids) {
//   let boid = boids[i];
//   let point = new Point(boid.pos.x, boid.pos.y)
//   qt.insert(point);
// }
//
// for (let i in boids) {
//   let boid = boids[i];
//
//   let range = new Rectangle(boid.pos.x, boid.pos.y, 20, 20);
//
//   let checkBoids = qt.query(range);
//
//   boid.flock(checkBoids);
//   boid.update();
//   boid.display();
// }




class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = 15;
    this.vel = {
      x: random(-0.1, .1),
      y: random(-.1, .1)
    };
  }

  move() {
    this.x += this.vel.x;
    this.y += this.vel.y;
  }

  update() {
    this.vel.x = random(-2, 2);
    this.vel.y = random(-2, 2);
  }


  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r);
  }
}