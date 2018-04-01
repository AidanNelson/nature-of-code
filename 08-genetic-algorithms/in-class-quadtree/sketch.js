let boids = [];


function setup() {
  createCanvas(windowWidth,windowHeight);
  for (let i = 0; i<10; i++){
    boids.push(new Boid(createVector(width/2,height/2)));
  }
}

function draw() {
  let boundary = new Rectangle(width/2,height/2,width,height);
  let qt = new QuadTree (boundary,4);
  background(30);


  for (let i in boids){
    let boid = boids[i];
    // let point = new Point(boid.position.x,boid.position.y)
    boid.flock(boids);
    boid.update();
    boid.display();
  }
}

function mouseDragged(){
  boids.push(new Boid(createVector(mouseX,mouseY)));
}
