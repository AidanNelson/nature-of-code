let walkers = [];
let img;

function preload(){
	img = loadImage('World_map_green.png');

}

function setup() {
	createCanvas(500,300);
	img.resize(500,300);

	let step = 10;
	for (let y = step; y < img.height; y+= step){
		for (let x = step; x < img.width; x += step){
			if (img.get(x,y)[3] > 0){
				let w = new Walker(x,y);
				walkers.push(w);
			}
		}
	}
}

function draw() {
	background(255,255,255,50);
	for (let i = 0; i<walkers.length; i++){
		walkers[i].update();
		walkers[i].render();
	}
}




class Walker {
	constructor(x,y){
		this.dest = createVector(x,y)
		this.pos = createVector(floor(random(width)),floor(random(height)));
		this.vel = createVector();
		this.acc = createVector();
	}

	render(){
		fill(0);
		ellipse(this.pos.x,this.pos.y, 8,8);
	}

	update(){
		this.flyAwayHome();
		if (dist(this.dest.x,this.dest.y,this.pos.x,this.pos.y) > 20){
			this.pos.add(this.vel);
		}
	}

	flyAwayHome(){
		let amnt = 0.02;
		if (this.pos.x > this.dest.x){
			this.vel.x -= amnt;
		}
		if (this.pos.y > this.dest.y){
			this.vel.y -= amnt;
		}
		if (this.pos.x < this.dest.x){
			this.vel.x += amnt;
		}
		if (this.pos.y < this.dest.y){
			this.vel.y += amnt;
		}
	}


	applyForce(f){
		this.vel.add(f);
	}
}
