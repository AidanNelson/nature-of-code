

let dog;
let herd;

setupSliders();

function setup() {

  createCanvas(windowWidth,windowHeight-50);

  herd = new Herd(50);
  dog = new Shepherd(10,10,herd);
}



function draw() {
  background(30);

  debugView();

  dog.run();
  herd.run();
}






function mouseDragged(){
  if (keyIsPressed){ // spacebar
    herd.addSheep(mouseX,mouseY);
  } else {
    dog.pos = createVector(mouseX,mouseY);
  }
}

function mouseClicked(){
  if (keyIsDown(84)) { // "t"
    dog.target = createVector(mouseX,mouseY);
  }
}

function debugView(){
  let gcm = herd.getGCM();
  let strayDist = dog.strayDistance;
  let target = dog.target;

  push();
  fill(255,0,0);
  stroke(255);

  // herd gcm
  ellipse(gcm.x,gcm.y,20,20);

  // dog's stray distance
  noFill();
  ellipse(gcm.x,gcm.y,strayDist,strayDist);

  // target
  fill(0,0,255);
  ellipse(target.x,target.y,25,25);

  // borders
  let b  = 50;
  line(b,b,width-b,b);
  line(width-b,b,width-b,height-b);
  line(b,height-b,width-b,height-b);
  line(b,b,b,height-b);
  pop();
}
