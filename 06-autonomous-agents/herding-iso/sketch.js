
let dog;
let herd;
let w,h;
let proj;

setupSliders();

function setup() {
  createCanvas(600,400,WEBGL);
  let scale = 2;
  w = width/scale;
  h = height/scale;
  proj = ortho(-w, w, h,-h, -1000, 5000);

  herd = new Herd(50);
  dog = new Shepherd(10,10,herd);

}

function draw() {
  background(200);

  // drawText();
  // debugView();


  keyboardControl();
  drawGround();

  dog.run();
  herd.run();
  //
  // // add to shepherd class?
  // switchTargets();
}



function drawGround(){
  push();
  rotateX(HALF_PI);
  translate(0,0,-5);
  noStroke();
  fill(255,45,200);
  plane(w,h);
  pop();
}


function drawText(){
  let instructions = "shift-click and drag to add sheep / press 'h' to see controls"
  textAlign(CENTER);
  textSize(24);
  fill(255);
  text(instructions,width/2,30);
  let explanation = "red circle is center of flock / blue circle is where dog wants sheep to go"
  text(explanation,width/2,height-20);
}

function switchTargets(){
  let gcm = herd.getGCM()
  let d = p5.Vector.dist(dog.target, gcm);
  if (d < 10){
    let b = 50;
    dog.target = createVector(random(b, width-b),random(b,height-b));
  }
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
  ellipse(gcm.x,gcm.y,2*strayDist,2*strayDist);

  // target
  fill(0,0,255);
  ellipse(target.x,target.y,25,25);

  // set the dog's current #1 stray sheep to be red
  herd.resetColors();
  if (dog.straySheep[0]) dog.straySheep[0].currentColor = color(255,0,0);

  // borders
  let b  = 50;
  line(b,b,width-b,b);
  line(width-b,b,width-b,height-b);
  line(b,height-b,width-b,height-b);
  line(b,b,b,height-b);
  pop();
}
