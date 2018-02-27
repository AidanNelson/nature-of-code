

let boids = [];

function setup() {
  createCanvas(windowWidth,windowHeight);
  for (let i = 0; i<10; i++){
    boids.push(new Boid(createVector(width/2,height/2)));
  }
}

function draw() {
  background(30);
  for (let i in boids){
    boids[i].flock(boids);
    boids[i].update();
    boids[i].display();
  }
}

function mouseDragged(){
boids.push(new Boid(createVector(mouseX,mouseY)));

}
