
// sheep sliders
let cohesionSlider;
let separationSlider;
let avoidanceSlider;
let shepherdDistanceSlider;
let neighborsSlider;

function setupSliders(){

  let sd = createDiv("Controls").class("controls");
  createP("").parent(sd);
  // sheep sliders
  createP("cohesion").parent(sd);
  cohesionSlider = createSlider(0,2,1.05,0.1).parent(sd);
  createP("separation").parent(sd);
  separationSlider = createSlider(0,2,2,0.1).parent(sd);
  createP("avoidance").parent(sd);
  avoidanceSlider = createSlider(0,2,1,0.1).parent(sd);
  createP("range of view").parent(sd);
  shepherdDistanceSlider = createSlider(0,200,65).parent(sd);
  createP("# neighbors").parent(sd);
  neighborsSlider = createSlider(0,200,20).parent(sd);

  // shepherd sliders
}
