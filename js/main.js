// Debeg
const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Object
function createFloor() {
  const textures_floor = new THREE.TextureLoader().load(
    "/textures/floor_tiles.jpg"
  );
  textures_floor.wrapS = textures_floor.wrapT = THREE.RepeatWrapping;
  textures_floor.offset.set(0, 0);
  textures_floor.repeat.set(8, 8);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ map: textures_floor, side: THREE.DoubleSide })
  );

  mesh.rotation.x = 1.57;
  mesh.position.y = -1.06;

  gui.add(mesh.position, "y", -3, 3, 0.01);
  var speed = 1;
  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
      mesh.position.x -= speed;
    } else if (keyCode == 40) {
      mesh.position.x += speed;
    }
  }

  return mesh;
}

const floor = createFloor();
scene.add(floor);

function createWheels() {
  const geometry = new THREE.CylinderGeometry(7, 7, 35, 50);
  const materials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/textures/wheel_side.jpg"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/textures/wheel.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/textures/wheel.png"),
      side: THREE.DoubleSide,
    }),
  ];
  const wheel = new THREE.Mesh(geometry, materials);
  return wheel;
}



function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  backWheel.rotation.x = 1.57;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  frontWheel.rotation.x = 1.57;
  car.add(frontWheel);

  var speed = 0.1;

  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
      frontWheel.rotation.y -= speed;
      backWheel.rotation.y -= speed;
    } else if (keyCode == 40) {
      frontWheel.rotation.y += speed;
      backWheel.rotation.y += speed;
    }
  }

  const main = new THREE.Mesh(
    new THREE.BoxGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0x27729c })
  );
  main.position.y = 12;
  car.add(main);

  

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(33, 12, 24),
    new THREE.MeshLambertMaterial({ color: 0xaa1b35 })
  );
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}

const car = createCar();
scene.add(car);

//light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

const aspectRatio = sizes.width / sizes.height;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;
const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
  0,
  10000
);
camera.position.set(300, 200, 200);
camera.up.set(0, 1, 0);
camera.lookAt(0, 10, 0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
camera.lookAt(0, 10, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();
// controls.target.y = 2
controls.enableDamping = true;

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
