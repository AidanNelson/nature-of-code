let walkers = [];
let img;
let size = 0;
function preload(){
	img = loadImage('World_map_green.png');

}

function setup() {
	createCanvas(windowWidth,windowHeight);
	img.resize(windowWidth,windowHeight);

  let numSteps = 50;
	let stepSize = windowWidth/numSteps;
	for (let y = stepSize; y < img.height; y+= stepSize){
		for (let x = stepSize; x < img.width; x += stepSize){
			if (img.get(x,y)[3] > 0){
				let w = new Walker(x,y);
				walkers.push(w);
			}
		}
	}
}

function draw() {
  clear();
	// background(255,255,255,50);
  text(round(frameRate()),10,10);
	for (let i = 0; i<walkers.length; i++){
		// walkers[i].work();
    if (mouseIsPressed){
      size +=0.5;
      walkers[i].work(createVector(0,0), size);
    } else {
      size = 0;
    }
    walkers[i].update();
  	walkers[i].render();
	}
}




class Walker {
	constructor(x,y){
		this.dest = createVector(x,y);
    this.pos = createVector(x,y);
		// this.pos = createVector(floor(random(width)),floor(random(height)));
		this.vel = createVector();
		this.acc = createVector();


    this.maxSpeed = 10;
    this.maxForce = 1;
	}

  work(target,size){
    // let homewardForce = this.getHomewardForce();
    let repulsiveForce = this.getRepulsiveForce(target, size);
    this.applyForce(repulsiveForce);
    // this.applyForce(homewardForce);
  }

	render(){
		fill(0);
		ellipse(this.pos.x,this.pos.y, 8,8);
	}

	update(){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0); // reset acceleration each frame
	}

	getHomewardForce(){
    let desired = p5.Vector.sub(this.dest,this.pos); // desired velocity direct to destination
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100){
      speed = map(d,0,100,0,this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(this.maxForce);
    return steer;
	}

  getRepulsiveForce(target,size){
    // let mouse = createVector(mouseX,mouseY);
    let desired = p5.Vector.sub(target,this.pos);
    let d = desired.mag();
    if (d<size){
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      let steer = p5.Vector.sub(desired,this.vel);
      steer.limit(this.maxSpeed);
      return steer;
    } else{
      return createVector(0,0);
    }
  }

	applyForce(f){
		this.acc.add(f);
	}
}
