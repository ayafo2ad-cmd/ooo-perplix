// main.js
// Scene, camera, renderer setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x001024);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 150);
light.position.set(0, 20, 20);
scene.add(light);

// Steps definition (Earth, ozone, hole, cell, DNA)
let step = 0;
function createEarth() {
  // Sphere for earth
  const geometry = new THREE.SphereGeometry(15, 50, 30);
  const material = new THREE.MeshStandardMaterial({color: 0x3e92cc, flatShading: true});
  const earth = new THREE.Mesh(geometry, material);

  // Add golden ozone sphere
  const ozoneMat = new THREE.MeshStandardMaterial({color: 0xffd700, wireframe: true, opacity: 0.6, transparent: true});
  const ozone = new THREE.Mesh(new THREE.SphereGeometry(18, 50, 30), ozoneMat);

  scene.add(earth); scene.add(ozone);
}
function clearScene() {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  scene.add(light);
}
function createOzoneHole() {
  // Add UV rays and hole effect (demo: animated lines)
  for(let i = 0; i < 12; i++) {
    const mat = new THREE.LineBasicMaterial({ color: 0xff00ff });
    const points = [];
    points.push(new THREE.Vector3(0, 0, 18));
    points.push(new THREE.Vector3(Math.sin(i)*24, Math.cos(i)*24, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(geo, mat));
  }
}
function createCellAndDNA() {
  // Cell as a sphere
  const cellMat = new THREE.MeshStandardMaterial({color: 0x9aedc2, flatShading: true});
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(12, 60, 40), cellMat));
  // DNA as a twisty tube (demo: helix with lines)
  const group = new THREE.Group();
  for(let i=0; i<36; i++) {
    const mat = new THREE.LineBasicMaterial({ color: 0x4444ff });
    const points = [];
    const theta = i/36 * Math.PI*4;
    points.push(new THREE.Vector3(Math.cos(theta)*5, i-18, Math.sin(theta)*5));
    points.push(new THREE.Vector3(Math.cos(theta+0.2)*5, i-17, Math.sin(theta+0.2)*5));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, mat));
  }
  group.position.x = 18;
  scene.add(group);
}
function createMutationEffect() {
  // Flashing red DNA line segments
  for(let i=0; i<10; i++) {
    const mat = new THREE.LineBasicMaterial({ color: Math.random() > 0.5 ? 0xff3333 : 0x00ff00 });
    const points = [];
    points.push(new THREE.Vector3(5, i-5, 3));
    points.push(new THREE.Vector3(6, i-4, 4));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(geo, mat));
  }
}

// Animation/step handler
window.addEventListener('click', () => {
  step++;
  clearScene();
  if(step === 1) { createEarth(); }
  if(step === 2) { createEarth(); createOzoneHole(); }
  if(step === 3) { createCellAndDNA(); }
  if(step === 4) { createMutationEffect(); }
  // Add organism, plant/fish, and MCQ logic as subsequent steps
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
