
class Obstacle{
  constructor(x,y,r){
    this.pos = createVector(x,y);
    this.radius = r;
  }
  display(){
    stroke(255);
    fill(255,0,0);
    ellipse(this.pos.x,this.pos.y,2*this.radius,2*this.radius);
  }
}

//////////////
let obstacles = [];
let boids = [];
let target;

function setup(){
  createCanvas(600,600);
  target = createVector(0,0);

  for (let i = 0; i< 10; i++){
    let r = random(25,50);
    obstacles.push(new Obstacle(random(width),random(height),r));
  }
  boids.push(new Boid(width/2,height/2));
}

function draw(){
  background(200);

  for (let i in boids){
    boids[i].seek(target);
    boids[i].avoidObstacles(obstacles);
    boids[i].update();
    boids[i].display();
  }

  for (let i in obstacles){
    // if (mouseIsPressed){
    //   obstacles[i].pos = createVector(mouseX,mouseY);
    // }
    obstacles[i].display();

  }

  fill(0,255,0);
  ellipse(target.x,target.y,10,10);
}

// function mouseDragged(){
//   boids.push(new Boid(mouseX,mouseY));
// }

function mousePressed(){
  target = createVector(mouseX,mouseY);
}
