let sc, shc, sys;
let gui;
let f1, f2, f3;


function loadPopulationJSON(fileList) {
  var tmppath = URL.createObjectURL(fileList[0]);
  loadJSON(tmppath, jsonLoaded);
}

function jsonLoaded(result) {
  let newPop = [];
  let n = result.generationNumber;
  console.log(n);
  generationNumber = result.generationNumber;
  settings = result.settings;
  // console.log(result.settings);
  for (let id in settings) {
    // console.log(id);
    sys[id] = settings[id];
  }
  // reload old gui
  // var gui = new dat.GUI({
  //   load: settings
  // });
  // gui.remember(sys);
  // f3 = gui.addFolder('simulation controls (h to hide)');
  // gui.add(sys, 'simulationSpeed', 1, 1000);
  // gui.add(sys, 'generationLength', 50, 1000, 25);
  // gui.add(sys, 'populationSize', 1, 100);
  // gui.add(sys, 'fitnessFunction', ['distance', 'circle']);
  // gui.add(sys, 'gcmInput', ['relative', 'absolute'])
  // gui.add(sys, 'debugMode');
  // gui.add(sys, 'savePopulation');
  // gui.add(sys, 'loadPopulation');

  for (let key in result.population) {
    let newBrain = NeuralNetwork.deserialize(result.population[key]);
    let c = color(random(50, 250), random(50, 250), random(50, 250));
    newPop.push(new Shepherd(c, newBrain));
  }
  population = newPop;
}


// var datGUI = function() {
//   this.message = 'dat.gui';
//   this.speed = 0.8;
//   this.displayOutline = false;
//   this.color1 = [ 0, 128, 255 ]; // RGB array
// };
//
// window.onload = function() {
//
//   var json = '{ \
//   "preset": "Default",\
//   "closed": false,\
//   "remembered": {\
//     "Default": {\
//       "0": {\
//         "message": "Value from JSON",\
//         "speed": 5,\
//         "displayOutline": true,\
//         "color1": [\
//           128,\
//           128,\
//           128\
//         ]\
//       }\
//     }\
//   },\
//   "folders": {}\
// }';
//
//   var text = new datGUI();
// var gui = new dat.GUI({ load: JSON.parse(json) });
//
//   gui.remember(text);
//
//   gui.add(text, 'message');
//   gui.add(text, 'speed', -5, 5);
//   gui.add(text, 'displayOutline');
//   gui.addColor(text, 'color1');
//   gui.add(text, 'message', [ 'pizza', 'chrome', 'hooray' ] );
// };






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
    this.populationSize = 25;
    this.debugMode = false;
    this.gcmInput = "absolute";
    this.fitnessFunction = "distance";
    this.savePopulation = function() {
      let data = {};
      data.generationNumber = generationNumber;
      data.settings = this;

      data.population = {};
      for (let i = 0; i < population.length; i++) {
        data.population[i] = population[i].brain.serialize();
      }
      // console.log(data);
      let name = 'Generation ' + generationNumber + '.json';
      save(data, name);
    }
    this.loadPopulation = function() {
      document.getElementById('myInput').click();
    }
  }


  //
  // var person = {
  //      name: 'Anne',
  //      oldName: 'Anne',
  //      setName: function() {
  //      	var oldName = this.oldName;
  //      	var newName = this.name;
  //      	alert('Changing ' + oldName + " to " + newName);
  //        this.oldName = this.name;
  //      }
  //  };
  //
  //  var gui = new dat.GUI();
  //  gui.add(person, 'name');
  //  gui.add(person, 'setName');

  //

  sc = new sheepControls();
  // shc = new shepherdControls();
  sys = new systemControls();
  gui = new dat.GUI();
  // dat.GUI.toggleHide();

  gui.remember(sys);

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
  gui.add(sys, 'simulationSpeed', 1, 1000).listen();
  gui.add(sys, 'generationLength', 50, 1000, 25).listen();
  gui.add(sys, 'populationSize', 1, 100).listen();
  gui.add(sys, 'fitnessFunction', ['distance', 'circle']).listen();
  gui.add(sys, 'gcmInput', ['relative', 'absolute']).listen();
  gui.add(sys, 'debugMode').listen();
  gui.add(sys, 'savePopulation').listen();
  gui.add(sys, 'loadPopulation').listen();

}

// function updatePopulation() {
//   console.log('update pop');
// }