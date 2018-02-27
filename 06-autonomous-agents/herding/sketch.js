let cohesionSlider;
let separationSlider;
let avoidanceSlider;
let shepherdDistanceSlider;
let neighborsSlider;

let dog;
let herd;

function setup() {
  setupSliders();
  createCanvas(windowWidth,windowHeight-50);

  herd = new Herd(50);
  dog = new Shepherd(10,10,herd);
}



function draw() {
  background(30);

  dog.run();
  herd.run();
}




function setupSliders(){
  cohesionSlider = createSlider(0,2,1.05,0.1);
  separationSlider = createSlider(0,2,2,0.1);
  avoidanceSlider = createSlider(0,2,1,0.1);
  shepherdDistanceSlider = createSlider(0,200,65);
  neighborsSlider = createSlider(0,200,20);
}

function mouseDragged(){
  if (keyIsPressed){ // spacebar
    herd.addSheep(mouseX,mouseY);
  } else {
    dog.pos = createVector(mouseX,mouseY);
  }
}
