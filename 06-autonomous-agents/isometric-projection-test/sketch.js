
let img;
let w,h;
let proj;

function preload(){
  img = loadImage("field.jpg");
}

function setup(){
  createCanvas(600,400,WEBGL);
  // camera(0, 0, 500, 0, 0, 0, 0, 1, 0);

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
  // normalMaterial();
  drawGround();
  drawFences(-10,-10,10,10);

  // for (let i = 0; i< 10; i++){
  //   for (let j=0; j<10; j++){
  //     push();
  //     translate(i*5,5,j*5);
  //     normalMaterial();
  //     box(3);
  //     pop();
  //   }
  // }
}

function drawFences(minX,minY,maxX,maxY){
  let h = 3;

  push();
  rotateX(-HALF_PI);
  normalMaterial();
  for (let i = minX; i <= maxX; i++){
    push();
    translate(i,minY,0);
    drawFencePost(h);
    pop();
    push();
    translate(i,maxY,0);
    drawFencePost(h);
    pop();
  }
  for (let j = minY; j <= maxY; j++){
    push();
    translate(minX,j,0);
    drawFencePost(h);
    pop();
    push();
    translate(maxX,j,0);
    drawFencePost(h);
    pop();
  }
pop();

  function drawFencePost(h){
    for (let i = 0; i < h; i++){
      push();
      translate(0,0,i);
      box(1);
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
