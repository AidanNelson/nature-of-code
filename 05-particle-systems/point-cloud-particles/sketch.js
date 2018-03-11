// hopes and dreams:
// 3d system
//
// LOD - level of detail changes over zoom in and out
//
// orbit controls
//
// fill specific space
//
// come from non-point source

//maybe combine threejs globe data with point PointCloud aka try to make a globe w points making up lines (and could be a way to represent shifting borders over time if we wanted to get really fancy.  look here: https://www.youtube.com/watch?v=r6YMKr1X0VA and here:https://www.youtube.com/watch?v=RkuBWEkBrZA)




let sys;

// point cloud points reduction and scale
let reductionFactor = 40;
let scale = 1500;

// keyboard control values
let tx=0;
let ty=0;
let tz=0;
let rx=0;
let ry=0;
let rz=0;

// bounding box values
let bbW = 0;
let bbH = 0;
let bbD = 0;

let gravityOn = false;
let img;


function preload(){
	loadTable("data/bunny.csv","csv",createParticleSystem);
	img = loadImage("data/bunny.png");
}

function createParticleSystem(table){
	let xMax = 0;
	let xMin = 0;
	let yMax = 0;
	let yMin = 0;
	let zMax = 0;
	let zMin = 0;

	// first, create a bounding box around all points in the cloud
	for (let i = 0; i < table.getRowCount(); i+= reductionFactor){
		// parsefloat necessary to ensure values from file aren't compared as strings
		let x = parseFloat(table.get(i,0));
		let y = parseFloat(table.get(i,1));
		let z = parseFloat(table.get(i,2));

		if (x > xMax){
			xMax = x;
		}
		if (x < xMin){
			xMin = x;
		}
		if (y > yMax){
			yMax = y;
		}
		if (y < yMin){
			yMin = y;
		}
		if (z > zMax){
			zMax = z;
		}
		if (z < zMin){
			zMin = z;
		}
	}
	console.log('xMax,xMin,yMax,yMin,zMax,zMin:',xMax,xMin,yMax,yMin,zMax,zMin);
	bbW = xMax-xMin;
	bbH = yMax-yMin;
	bbD = zMax-zMin;


	console.log('w/h/d of bounding box: ',bbW,'/',bbH,'/',bbD);

	// use min/max values from bounding box to map everything around 0,0
	for (let i = 0; i < table.getRowCount(); i+= reductionFactor){
		let x = parseFloat(table.get(i,0));
		let y = parseFloat(table.get(i,1));
		let z = parseFloat(table.get(i,2));

		// map around 0,0 without scaling values
		x = map(x, xMin,xMax,-bbW/2,bbW/2);
		y = map(y, yMin,yMax,bbH/2,-bbH/2); //flip Y for the bunny
		z = map(z, zMin,zMax,-bbD/2,bbD/2);

		table.setNum(i,0,x);
		table.setNum(i,1,y);
		table.setNum(i,2,z);
	}

	// scale this after the mapping to avoid scaling x,y,z values twice
	bbW = bbW * scale;
	bbH = bbH * scale;
	bbD = bbD * scale;

	sys = new PointCloudParticleSystem(table,reductionFactor,scale);
}



function setup() {
	createCanvas(800, 400, WEBGL);

	KeyboardControl.init();

	camera(0, 0, 600, 0, 0, 0, 0, 1, 0);
	perspective(0.8, width/height, 50, 5000);
}

function draw() {
	background(200);

	
	KeyboardControl.run();



	if (gravityOn){
		let grav = createVector(0,1,0);
		sys.applyForce(grav);
	}

	if (keyIsDown(72)){ // 'h'
		gravityOn = false;
		sys.bringThemHome();
	}

	push();
	normalMaterial();
	keyboardControl();
	drawFloor();	//if this goes before keyboard control it won't move
	// drawBoundingBox();
	sys.run();
	pop();

}

function drawFloor(){
	push();
	let depth = width;
	translate(0,100,300/2);
	rotateX(PI/2);
	fill(235,50,250);
	plane(width,depth);
	pop();
}

function drawBoundingBox(){
	let padding = 10;
	push();
	noFill();
	stroke(0);
	strokeWeight(0.5);
	box(bbW + padding,bbH + padding,bbD + padding);
	pop();
}






// turn this into an object like https://github.com/processing/p5.js/blob/master/src/webgl/interaction.js#L31
function keyboardControl(){
	// these values can be mapped to framerate??
	let rotationStep = PI/48;
	let translationStep = 10;
	// zoom
	if (keyIsDown(38)&& !keyIsDown(16)) {
		ty+=translationStep;
	}
	if (keyIsDown(40)&& !keyIsDown(16)){
		ty-=translationStep;
	}

	// pan left-right
	if (keyIsDown(37) && !keyIsDown(16)) {
		tx+=translationStep;
	}
	if (keyIsDown(39) && !keyIsDown(16)){
		tx-=translationStep;
	}

	// rotate about X
	if (keyIsDown(38)&& keyIsDown(16)) {
		rx+=rotationStep;
	}
	if (keyIsDown(40)&& keyIsDown(16)){
		rx-=rotationStep;
	}
	//rotate about Y
	if (keyIsDown(37) && keyIsDown(16)) {
		ry+= rotationStep;
	}
	if (keyIsDown(39) && keyIsDown(16)){
		ry-=rotationStep;
	}

	//zoom
	if (keyIsDown(38) && keyIsDown(18)) {
		tz+=translationStep;
	}
	if (keyIsDown(40) && keyIsDown(18)){
		tz-=translationStep;
	}

	if (keyIsDown(71)){ //'g'
		gravityOn = true;
	}

	translate(tx,ty,tz);
	rotateX(rx);
	rotateY(ry);
	rotateZ(rz);
}
