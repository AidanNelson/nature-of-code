
let v;
let ff;


let v3d;
let ff3d;

function setup(){
  createCanvas(windowWidth,windowHeight);

  v = new Vehicle(createVector(width/2,height/2,0),1);
  v.vel.x += random(-5,5);
  v.vel.y += random(-5,5);

  ff = new FlowField();

  // createCanvas(600,400,WEBGL);

  // v3d = new Vehicle3D(createVector(0,0,0));
  // v3d.vel.x += random(-5,5);
  // v3d.vel.y += random(-5,5);


  // ff3d = new FlowField3D();
}

function draw(){
  background(255,30,30);

  let mouse = createVector(mouseX,mouseY,0);

  // v.seek(mouse);
  // v.arrive(mouse);
  // v.stayWithinWalls(50);
  v.follow(ff);

  v.update();
  v.display();

  ff.display();

  // keyboardControl();
  // v3d.display();
  // ff3d.display();
}
