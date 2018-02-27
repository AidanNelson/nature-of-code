
// spinning box : https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);


let geometry = new THREE.BoxGeometry(1,1,1);
let material = new THREE.MeshBasicMaterial({color:0x00ff00});
let cube = new THREE.Mesh(geometry,material);

scene.add(cube);

camera.position.z=5;

// adding orbit controls:
// https://threejs.org/docs/#examples/controls/OrbitControls
let controls = new THREE.OrbitControls( camera );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  cube.rotation.x+= 0.01;
  cube.rotation.y+=0.01;
  renderer.render(scene,camera);
}

animate();

//
// // drawing lines: https://threejs.org/docs/index.html#manual/introduction/Drawing-lines
//
// let renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth,window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,500);
// camera.position.set(0,0,100);
// camera.lookAt(new THREE.Vector3(0,0,0));
//
// let scene = new THREE.Scene();
//
// // create blue lineBasicMaterial
// let material = new THREE.LineBasicMaterial({color:0x0000ff});
// let geometry = new THREE.Geometry();
//
// // add three vertices to geometry object
// geometry.vertices.push(new THREE.Vector3(-10,0,0));
// geometry.vertices.push(new THREE.Vector3(0,10,0));
// geometry.vertices.push(new THREE.Vector3(10,0,0));
//
// let line = new THREE.Line(geometry, material);
//
// scene.add(line);
// renderer.render(scene,camera);
//
//
