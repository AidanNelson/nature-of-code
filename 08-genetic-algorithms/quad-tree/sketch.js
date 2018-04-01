// following along with.... https://www.youtube.com/watch?v=OJxEcs0w_kE

let qt;
let myPoints = [];

function setup() {


  createCanvas(400, 400);
  background(0);
  let boundary = new Rectangle(width / 2, height / 2, width, height);
  qt = new QuadTree(boundary, 4);
  console.log(qt);

  for (let i = 0; i < 300; i++) {
    let p = new Point(randomGaussian(width / 2, width / 8), randomGaussian(height / 2, height / 8));
    noStroke();
    fill(255);
    ellipse(p.x, p.y, 1, 1);
    myPoints.push(p);
    qt.insert(p);
  }

  qt.display();
}

function draw() {
  background(0);
  qt.display();

  stroke(0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(mouseX, mouseY, 50, 50);
  rect(range.x, range.y, range.w, range.h);

  for (let p of myPoints) {
    noStroke();
    fill(255);
    ellipse(p.x, p.y, 1, 1);
  }

  let points = qt.query(range);
  for (let p of points) {
    strokeWeight(2);
    ellipse(p.x, p.y, 5, 5);
  }


  // if (mouseIsPressed) {
  //   let p = new Point(mouseX, mouseY);
  //   noStroke();
  //   fill(255);
  //   ellipse(p.x, p.y, 1, 1);
  //   qt.insert(p);
  // }

}