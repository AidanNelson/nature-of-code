let sc, shc;
let gui;
let f1,f2;

function setupSliders(){
  function sheepControls() {
    this.cohesion = 1;
    this.separation = 1;
    this.avoidance = 1;
    this.detectionDistance = 100;
    this.nNeighbors = 10;
  };

  function shepherdControls() {
    this.strayDistance = 150;
    this.crouchDistance = 50;
    this.driveDistance = 50;
    this.collectDistance = 50;
  };

  sc = new sheepControls();
  shc = new shepherdControls();

  gui = new dat.GUI();

  f1 = gui.addFolder('sheep controls');
  gui.add(sc, 'cohesion',0,2);
  gui.add(sc, 'separation', 0,2);
  gui.add(sc, 'avoidance',0,2);
  gui.add(sc, 'detectionDistance', 0,200);
  gui.add(sc, 'nNeighbors',0,200);

  f2 = gui.addFolder('shepherd controls');
  gui.add(shc, 'strayDistance', 0,280);
  gui.add(shc, 'crouchDistance',0,200);
  gui.add(shc, 'driveDistance', 0,200);
  gui.add(shc, 'collectDistance',0,200);
  f2.open();
}
