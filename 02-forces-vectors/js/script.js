class Mover {
  constructor(x,y,z){
    this.pos = new THREE.Vector3(x,y,z);
    this.vel = new THREE.Vector3();
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial({color:0x00ff00});
    this.cube = new THREE.Mesh(geometry,material);
  }

  applyForce(f){
    this.vel.add(f);
  }

  update(){
    this.pos.add(this.vel);
  }
}

// spinning box : https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

let mover = new Mover(0,0,0);
scene.add(mover.cube);

camera.position.z = 5;



function animate(){
  requestAnimationFrame(animate);
  mover.update();
  renderer.render(scene,camera);
}

mover.applyForce(new THREE.Vector3(1,0,0));
animate();
