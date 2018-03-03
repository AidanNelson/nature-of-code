// keyboard control values
let tx=0;
let ty=0;
let tz=0;
let rx=-0.25;
let ry=-2.15;
let rz=0;
let scale = 10;

// turn this into an object like https://github.com/processing/p5.js/blob/master/src/webgl/interaction.js#L31
function keyboardControl(){

	// these values can be mapped to framerate??
	let rotationStep = PI/48;
	let translationStep = 10;

	// // zoom
	// if (keyIsDown(38)&& !keyIsDown(16)) {
	// 	ty+=translationStep;
	// }
	// if (keyIsDown(40)&& !keyIsDown(16)){
	// 	ty-=translationStep;
	// }

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
		scale += 0.25;
		w = width/scale;
	  h = height/scale;
	  proj = ortho(-w, w, h,-h, 0, 5000);
	}
	if (keyIsDown(40) && keyIsDown(18)){
		scale -= 0.25;
		w = width/scale;
	  h = height/scale;
	  proj = ortho(-w, w, h,-h, 0, 5000);
	}




	translate(tx,ty,tz);
	rotateX(rx);
	rotateY(ry);
	rotateZ(rz);
}
