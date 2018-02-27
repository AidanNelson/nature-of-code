





let mover;
let attractor;
let ground;

// 'aliasing' matter.js classes:
const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;
const Render = Matter.Render;

let engine,world,render;

let options = {
  velocityIterations:1,
  timing: {
    timeScale:0.5
  }
};

// matter.js stuff
engine = Engine.create(options);
world = engine.world;
render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 640,
        height: 360,
        pixelRatio: 1,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: false,
        enabled: true,
        wireframes: true,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: true,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
    }
});

function setup(){
  createCanvas(640,360);

  mover = new Mover(width/2,0,40,10);
  attractor = new Attractor();

  let bOptions = {
    isStatic: true
  }

  ground = Bodies.rectangle(width/2, height,width, 20, bOptions);
  World.add(engine.world,[ground]);
}


function draw(){
  background(200,100,200);

  Engine.run(engine); // step through time with our physics enginge

  Render.run(render);

  mover.display();
  if (mouseIsPressed){
    let f = createVector(0.0,-0.03);
    mover.applyForce(f);
  }
}
