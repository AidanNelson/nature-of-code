let sc, shc, sys;
let gui;
let f1, f2, f3;

function setupSliders() {
  function sheepControls() {
    this.graze = 0.01;
    this.stayWithinWalls = 1.0;
    this.cohesion = 1.3;
    this.separation = 1.5;
    this.avoidance = 1.3;
    this.alignment = 1.3;
    this.detectionDistance = 100;
    this.nNeighbors = 25;
  };

  //
  // function shepherdControls() {
  //   this.strayDistance = 130;
  //   this.crouchDistance = 50;
  //   this.driveDistance = 80;
  //   this.collectDistance = 80;
  //   this.avoidFlock = 0.1;
  // };

  function systemControls() {
    this.simulationSpeed = 1;
    this.generationLength = 250;
  }
  sc = new sheepControls();
  // shc = new shepherdControls();
  sys = new systemControls();
  gui = new dat.GUI();
  // dat.GUI.toggleHide();

  // f1 = gui.addFolder('sheep controls (h to hide)');
  // gui.add(sc, 'graze', 0.00, 0.02, 0.005);
  // gui.add(sc, 'stayWithinWalls', 0.0, 2.0);
  // gui.add(sc, 'cohesion', 0.0, 2.0);
  // gui.add(sc, 'separation', 0.0, 2.0);
  // gui.add(sc, 'avoidance', 0.0, 2.0);
  // gui.add(sc, 'alignment', 0.0, 2.0);
  // gui.add(sc, 'detectionDistance', 0, 200);
  // gui.add(sc, 'nNeighbors', 0, 200);

  // f2 = gui.addFolder('shepherd controls  (h to hide)');
  // gui.add(shc, 'strayDistance', 0, 280);
  // gui.add(shc, 'crouchDistance', 0, 200);
  // gui.add(shc, 'driveDistance', 0, 200);
  // gui.add(shc, 'collectDistance', 0, 200);
  // gui.add(shc, 'avoidFlock', 0.0, 2.0);
  // f2.open();

  f3 = gui.addFolder('simulation controls (h to hide)');
  gui.add(sys, 'simulationSpeed', 1, 1000);
  gui.add(sys, 'generationLength', 50, 1000, 25);
}