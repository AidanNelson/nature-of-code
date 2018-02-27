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
	// image(img,0,0);
	for (let i = 0; i<walkers.length; i++){
		walkers[i].render();
	}
}




class Walker {
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.steps = [];
		this.steps.push({x:this.x,y:this.y});
		for (let i=0; i<floor(random(100,800)); i++){
			this.stepForwards();
		}
	}

	render(){
		this.stepBackwards();
		fill(0);
		ellipse(this.x,this.y, 8,8);
	}

	stepBackwards(){
		if (this.steps.length > 0){
			let	{x,y} = this.steps.pop();
			this.x = x;
			this.y = y;
		}
	}

	stepForwards(){
		let r = random(1);
		let stepSize = 5;
		if (r < 0.25){
			this.x += stepSize;
		} else if (r < 0.5){
			this.x -= stepSize;
		} else if (r < 0.75){
			this.y += stepSize;
		} else {
			this.y -= stepSize;
		}
		this.x = constrain(this.x,0,width);
		this.y = constrain(this.y,0,height);
		this.steps.push({x: this.x,y: this.y});
	}
}
