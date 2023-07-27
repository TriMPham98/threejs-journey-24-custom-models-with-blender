// Import Three.js
import * as THREE from "three";

// Import OrbitControls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Import GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Import DRACOLoader
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Import dat.gui
import * as dat from "lil-gui";

// Enable color management
THREE.ColorManagement.enabled = false;

// Debug GUI
const gui = new dat.GUI();

// Get canvas element
const canvas = document.querySelector("canvas.webgl");

// Create scene
const scene = new THREE.Scene();

// DRACO loader
const dracoLoader = new DRACOLoader();

// Set DRACO decoder path
dracoLoader.setDecoderPath("/draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();

// Set DRACO loader
gltfLoader.setDRACOLoader(dracoLoader);

// Mixer
let mixer = null;

// Load GLTF model
// gltfLoader.load('/models/hamburger.glb', (gltf) => {
//   scene.add(gltf.scene);
// });

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);

// Receive shadows
floor.receiveShadow = true;

// Rotation
floor.rotation.x = -Math.PI * 0.5;

// Add to scene
scene.add(floor);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

// Add to scene
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

// Cast shadows
directionalLight.castShadow = true;

// Shadow map size
directionalLight.shadow.mapSize.set(1024, 1024);

// Shadow camera far
directionalLight.shadow.camera.far = 15;

// Shadow camera left
directionalLight.shadow.camera.left = -7;

// Shadow camera top
directionalLight.shadow.camera.top = 7;

// Shadow camera right
directionalLight.shadow.camera.right = 7;

// Shadow camera bottom
directionalLight.shadow.camera.bottom = -7;

// Position
directionalLight.position.set(5, 5, 5);

// Add to scene
scene.add(directionalLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize event
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera aspect
  camera.aspect = sizes.width / sizes.height;

  // Update projection
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(sizes.width, sizes.height);

  // Set pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// Position
camera.position.set(-8, 4, 8);

// Add to scene
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

// Set controls target
controls.target.set(0, 1, 0);

// Enable damping
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// Renderer color space
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Shadow map enabled
renderer.shadowMap.enabled = true;

// Shadow map type
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set size
renderer.setSize(sizes.width, sizes.height);

// Pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

// Previous time
let previousTime = 0;

// Tick function
const tick = () => {
  // Elapsed time
  const elapsedTime = clock.getElapsedTime();

  // Delta time
  const deltaTime = elapsedTime - previousTime;

  // Update previous time
  previousTime = elapsedTime;

  // Update mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
};

// Start animation
tick();
