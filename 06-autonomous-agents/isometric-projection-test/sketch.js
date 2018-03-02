
let img;
let w,h;
let proj;

function preload(){
  img = loadImage("field.jpg");
}

function setup(){
  createCanvas(600,400,WEBGL);
  // camera(0, 0, 500, 0, 0, 0, 0, 1, 0);
  let scale = 10;

  w = width/scale;
  h = height/scale;
  proj = ortho(-w, w, h,-h, 0, 5000);

}


function draw(){
  // rotateY(HALF_PI);
  // rotateX(PI*0.05);
  background(200);

  // translate(0,0,500);
  keyboardControl();
  drawGround();

  for (let i = 0; i< 10; i++){
    for (let j=0; j<10; j++){
      push();
      translate(i*5,5,j*5);
      normalMaterial();
      box(3);
      pop();
    }
  }
}


function drawGround(){
  push();
  rotateX(HALF_PI);
  fill(255,200,200);
  // texture(img);
  noStroke();
  plane(400,400);
  pop();
}
