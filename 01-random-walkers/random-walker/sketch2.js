let w;
let cat;

function preload(){
		// cat = loadModel("Mesh_Cat.obj", true);
}

function setup(){
	createCanvas(900,500,WEBGL);
	w = new Walker(0,0,0);

}

function draw(){
	background(255);
	orbitControl();
	w.render();

	// model(cat);
}

class Walker{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.positions = [];
		let pos = {
			x: this.x,
			y: this.y,
			z: this.z
		}
		this.positions.push(pos);
	}

	render(){
		this.step();
		for (let i = 0; i< this.positions.length; i++){
			let pos = this.positions[i];
			push();
			translate (pos.x,pos.y,pos.z);
			box(15);
			pop();
		}
		// translate (this.x,this.y,this.z);
		// sphere(5);
	}

	step(){
		let possibilities = [0,1,2,3,4,5];
		let i = possibilities[floor(random(possibilities.length))];

		let step = 15;

		if (i == 0){
			this.x += step;
		} else if (i == 1){
			this.x -= step;
		} else if (i == 2){
			this.y += step;
		} else if (i == 3){
			this.y -= step;
		} else if (i == 4){
			this.z += step;
		} else{
			this.z -= step;
		}

		let pos = {
			x: this.x,
			y: this.y,
			z: this.z
		}
		this.positions.push(pos);
	}
}
