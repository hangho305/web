import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const DIR = "assets/3d/";
const DRACO_PATH =
  "https://cdn.jsdelivr.net/npm/three@0.183.2/examples/jsm/libs/draco/";

const REF_ASPECT = 496 / 1078;

const FLAT_MATERIALS = new Set([
  "grass_samples",
  "bushes",
  "flower_1",
  "flower_2",
  "flower_3",
  "flower_4",
  "Ground",
  "GROUND.002",
]);

const CUTOUT_MATERIALS = new Set([
  "grass_samples",
  "bushes",
  "flower_1",
  "flower_2",
  "flower_3",
  "flower_4",
]);

const MATERIAL_TWEAKS = new Map([

  ["Material.003", { roughness: 0.95, metalness: 0.0 }],
]);

const SKY_THETA = new THREE.Vector2(-0.803527, 0.592737);
const SKY_ROTATION = 0;

const SKY_VERTEX = `
varying vec2 vNdc;
void main() {
  vNdc = position.xy;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`;

const SKY_FRAGMENT = `
uniform sampler2D uMap;
uniform vec2 uTheta;
uniform float uSkyRotation;
uniform mat4 uCameraWorld;
uniform mat4 uProjectionInverse;
varying vec2 vNdc;

void main() {
  vec4 viewRay = uProjectionInverse * vec4(vNdc, -1.0, 1.0);
  vec3 dir = normalize(mat3(uCameraWorld) * (viewRay.xyz / viewRay.w));

  float psi = atan(dir.x, -dir.z);
  float theta = asin(clamp(dir.y, -1.0, 1.0));

  float u = (psi + uSkyRotation) * 0.15915494309189535 + 0.5;
  float v = (theta - uTheta.x) / (uTheta.y - uTheta.x);

  gl_FragColor = texture2D(uMap, vec2(u, clamp(v, 0.0, 1.0)));
  #include <colorspace_fragment>
}`;

const WIND_DIRECTION = new THREE.Vector2(0.77, 0.64).normalize();
const WIND_SPEED = 2.0;
const WIND_SCALE = 0.35;
const WIND_STRENGTH = new Map([
  ["grass_samples", 0.16],
  ["bushes", 0.085],
  ["GROUND.002", 0.13],
  ["flower_1", 0.14],
  ["flower_2", 0.14],
  ["flower_3", 0.14],
  ["flower_4", 0.14],
]);

const WIND_DECLARATIONS = `#include <common>
attribute float aWindWeight;
uniform float uTime;
uniform vec2 uWindDirection;
uniform float uWindStrength;
uniform float uWindSpeed;
uniform float uWindScale;`;

const WIND_VERTEX = `#include <project_vertex>
#ifdef USE_INSTANCING
  mat3 windBasis = mat3(modelMatrix) * mat3(instanceMatrix);
  vec3 windOrigin = (modelMatrix * instanceMatrix[3]).xyz;
#else
  mat3 windBasis = mat3(modelMatrix);
  vec3 windOrigin = modelMatrix[3].xyz;
#endif
float windUp = length(windBasis * vec3(0.0, 1.0, 0.0));
float windPhase = dot(windOrigin.xz, uWindDirection) * uWindScale;
float windT = uTime * uWindSpeed;
float windSway = sin(windT + windPhase) * 0.75 + sin(windT * 2.3 + windPhase * 1.7 + 1.7) * 0.25;
float windGust = 0.65 + 0.35 * sin(windT * 0.27 + windPhase * 0.35);
vec3 windOffset = vec3(uWindDirection.x, 0.0, uWindDirection.y) *
  (aWindWeight * windUp * uWindStrength * windSway * windGust);
mvPosition.xyz += mat3(viewMatrix) * windOffset;
gl_Position = projectionMatrix * mvPosition;`;

const PARALLAX_PIVOT_DISTANCE = 42;
const CAMERA_DOLLY = 10;
const PARALLAX_RANGE_X = 0.5;
const PARALLAX_RANGE_Y = 0.3;
const PARALLAX_SMOOTHING = 0.002;

const SHADOW_TARGET = new THREE.Vector3(39, 4, 6);
const SHADOW_EXTENT = 100;
const SHADOW_DISTANCE = 60;

const canvas = document.getElementById("scene3d");

let renderer;
let scene;
let camera;
let mixer;
let clock;
let baseFov = 40;

const pointer = new THREE.Vector2();
const pointerTarget = new THREE.Vector2();
const cameraBase = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const cameraUp = new THREE.Vector3();
const parallaxPivot = new THREE.Vector3();
const windTime = { value: 0 };
let skyUniforms = null;

const materialCache = new Map();

function convertMaterial(source) {
  if (materialCache.has(source.uuid)) {
    return materialCache.get(source.uuid);
  }

  let material = source;

  if (FLAT_MATERIALS.has(source.name)) {
    material = new THREE.MeshBasicMaterial({
      map: source.map || null,
      color: source.color ? source.color.clone() : new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
    });
    material.name = source.name;
  }

  if (CUTOUT_MATERIALS.has(source.name)) {
    material.transparent = false;
    material.depthWrite = true;
    material.alphaTest = 0.5;
    material.side = THREE.DoubleSide;
  }

  const tweak = MATERIAL_TWEAKS.get(source.name);
  if (tweak) Object.assign(material, tweak);

  materialCache.set(source.uuid, material);
  return material;
}

async function loadInstanceData() {
  const manifest = await fetch(DIR + "instances.json").then((r) => r.json());
  const buffer = await fetch(DIR + manifest.buffer).then((r) =>
    r.arrayBuffer(),
  );
  return { manifest, buffer };
}

function createSkyBackdrop(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uTheta: { value: SKY_THETA },
      uSkyRotation: { value: SKY_ROTATION },
      uCameraWorld: { value: new THREE.Matrix4() },
      uProjectionInverse: { value: new THREE.Matrix4() },
    },
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  skyUniforms = material.uniforms;

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return mesh;
}

function updateSky() {
  if (!skyUniforms) return;
  camera.updateMatrixWorld();
  skyUniforms.uCameraWorld.value.copy(camera.matrixWorld);
  skyUniforms.uProjectionInverse.value.copy(camera.projectionMatrixInverse);
}

function setupWindMaterial(material) {
  const strength = WIND_STRENGTH.get(material.name);
  if (strength === undefined) return false;
  if (material.userData.wind) return true;

  material.userData.wind = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = windTime;
    shader.uniforms.uWindDirection = { value: WIND_DIRECTION };
    shader.uniforms.uWindStrength = { value: strength };
    shader.uniforms.uWindSpeed = { value: WIND_SPEED };
    shader.uniforms.uWindScale = { value: WIND_SCALE };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", WIND_DECLARATIONS)
      .replace("#include <project_vertex>", WIND_VERTEX);
  };
  material.customProgramCacheKey = () => "wind";
  return true;
}

function addWindWeight(geometry) {
  if (geometry.getAttribute("aWindWeight")) return;

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const height = Math.max(box.max.y - box.min.y, 1e-5);
  const positions = geometry.getAttribute("position");
  const weights = new Float32Array(positions.count);

  for (let i = 0; i < positions.count; i++) {
    const h = (positions.getY(i) - box.min.y) / height;
    weights[i] = h * h * height;
  }

  geometry.setAttribute("aWindWeight", new THREE.BufferAttribute(weights, 1));
}

function applyWind(mesh) {
  if (setupWindMaterial(mesh.material)) addWindWeight(mesh.geometry);
}

function buildInstances(prototypeScene, manifest, buffer) {
  const prototypes = new Map();

  prototypeScene.traverse((object) => {
    if (!object.isMesh) return;
    const original = (object.userData && object.userData.name) || object.name;
    prototypes.set(original.replace(/^__p_/, ""), object);
  });

  const u16 = new Uint16Array(buffer);
  const i16 = new Int16Array(buffer);
  const words = manifest.stride / 2;

  const group = new THREE.Group();
  group.name = "scattered";

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  for (const [name, entry] of Object.entries(manifest.prototypes)) {
    const prototype = prototypes.get(name);
    if (!prototype) continue;

    const mesh = new THREE.InstancedMesh(
      prototype.geometry,
      convertMaterial(prototype.material),
      entry.count,
    );
    mesh.name = name;

    const base = entry.byteOffset / 2;
    const pMin = entry.positionMin;
    const pSpan = entry.positionSpan;

    for (let i = 0; i < entry.count; i++) {
      const o = base + i * words;

      position.set(
        pMin[0] + (u16[o] / 65535) * pSpan[0],
        pMin[1] + (u16[o + 1] / 65535) * pSpan[1],
        pMin[2] + (u16[o + 2] / 65535) * pSpan[2],
      );
      quaternion
        .set(
          i16[o + 3] / 32767,
          i16[o + 4] / 32767,
          i16[o + 5] / 32767,
          i16[o + 6] / 32767,
        )
        .normalize();

      const uniform = entry.scaleMin + (u16[o + 7] / 65535) * entry.scaleSpan;
      scale.set(uniform, uniform, uniform);

      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    applyWind(mesh);
    group.add(mesh);
  }

  return group;
}

function addLights() {
  const key = new THREE.DirectionalLight(0xffffff, 1.44);

  key.target.position.copy(SHADOW_TARGET);
  key.position
    .set(-0.3, 0.7498, 0.5817)
    .multiplyScalar(SHADOW_DISTANCE)
    .add(SHADOW_TARGET);

  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -SHADOW_EXTENT;
  key.shadow.camera.right = SHADOW_EXTENT;
  key.shadow.camera.top = SHADOW_EXTENT;
  key.shadow.camera.bottom = -SHADOW_EXTENT;
  key.shadow.camera.near = SHADOW_DISTANCE - SHADOW_EXTENT;
  key.shadow.camera.far = SHADOW_DISTANCE + SHADOW_EXTENT;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  key.shadow.camera.updateProjectionMatrix();

  scene.add(key.target);
  scene.add(key);

  const warm = new THREE.DirectionalLight(0xffec40, 1.2);
  warm.position.set(0.1887, 0.6533, -0.7332).multiplyScalar(60);
  scene.add(warm);
}

function setupParallax() {
  cameraBase.copy(camera.position);
  cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  cameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
  parallaxPivot
    .set(0, 0, -1)
    .applyQuaternion(camera.quaternion)
    .multiplyScalar(PARALLAX_PIVOT_DISTANCE - CAMERA_DOLLY)
    .add(cameraBase);

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      1 - (event.clientY / window.innerHeight) * 2,
    );
  });
}

function updateParallax(delta) {
  pointer.lerp(pointerTarget, 1 - Math.pow(PARALLAX_SMOOTHING, delta));

  camera.position
    .copy(cameraBase)
    .addScaledVector(cameraRight, pointer.x * PARALLAX_RANGE_X)
    .addScaledVector(cameraUp, pointer.y * PARALLAX_RANGE_Y);
  camera.lookAt(parallaxPivot);
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  windTime.value += delta;
  if (mixer) mixer.update(delta);
  updateParallax(delta);
  updateSky();

  renderer.render(scene, camera);
}

function resize() {

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const aspect = width / height;

  renderer.setSize(width, height, false);

  camera.aspect = aspect;
  camera.fov =
    aspect < REF_ASPECT
      ? THREE.MathUtils.radToDeg(
          2 *
            Math.atan(
              Math.tan(THREE.MathUtils.degToRad(baseFov) / 2) *
                (REF_ASPECT / aspect),
            ),
        )
      : baseFov;
  camera.updateProjectionMatrix();

  updateSky();
  render();
}

async function init() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();

  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
  const gltfLoader = new GLTFLoader().setDRACOLoader(draco);

  const [sky, skyDetail, sceneGltf, prototypeGltf, instanceData] =
    await Promise.all([
      new THREE.TextureLoader().loadAsync(DIR + "sky.jpg"),
      new THREE.TextureLoader().loadAsync(DIR + "sky-detail.jpg"),
      gltfLoader.loadAsync(DIR + "scene.glb"),
      gltfLoader.loadAsync(DIR + "prototypes.glb"),
      loadInstanceData(),
    ]);

  sky.mapping = THREE.EquirectangularReflectionMapping;
  sky.colorSpace = THREE.SRGBColorSpace;

  scene.environment = sky;
  scene.environmentRotation.set(0, Math.PI / 2, 0);
  scene.environmentIntensity = 0.9;

  let blenderCamera = null;
  sceneGltf.scene.traverse((object) => {
    if (object.isCamera && !blenderCamera) blenderCamera = object;
    if (object.isMesh) {
      object.material = convertMaterial(object.material);
      applyWind(object);

      const flat = FLAT_MATERIALS.has(object.material.name);
      object.castShadow = !flat;
      object.receiveShadow = !flat;
    }
  });

  sceneGltf.scene.traverse((object) => {

  if (object.isCamera && !blenderCamera) {
    blenderCamera = object;
  }

  if (object.isMesh) {

    object.material =
      convertMaterial(object.material);

    applyWind(object);


    const excluded = new Set([
      "grass_samples",
      "bushes",
      "Ground",
      "GROUND.002",
      "flower_1",
      "flower_2",
      "flower_3",
      "flower_4"
    ]);

    const mat = object.material;

    if (
      mat &&
      mat.color &&
      !excluded.has(mat.name)
    ) {

      const hsl = {};

      mat.color.getHSL(hsl);

      mat.color.setHSL(
        hsl.h,
        Math.min(hsl.s * 1, 1),
        Math.min(hsl.l * 0.998, 1)
      );

    }
  }

});

  scene.add(createSkyBackdrop(skyDetail));
  scene.add(sceneGltf.scene);
  scene.add(
    buildInstances(
      prototypeGltf.scene,
      instanceData.manifest,
      instanceData.buffer,
    ),
  );

  camera = new THREE.PerspectiveCamera(baseFov, 1, 0.1, 200);

  if (blenderCamera) {
    blenderCamera.updateWorldMatrix(true, false);
    camera.position.setFromMatrixPosition(blenderCamera.matrixWorld);
    camera.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().extractRotation(blenderCamera.matrixWorld),
    );
    baseFov = blenderCamera.fov;
    camera.near = blenderCamera.near;
    camera.far = blenderCamera.far;
  }

  camera.translateZ(-CAMERA_DOLLY);

  addLights();

  clock = new THREE.Clock();

  if (sceneGltf.animations.length) {
    mixer = new THREE.AnimationMixer(sceneGltf.scene);
    mixer.timeScale = 0.3;
    for (const clip of sceneGltf.animations) {
      mixer.clipAction(clip).play();
    }
  }

  setupParallax();

  draco.dispose();

  resize();
  window.addEventListener("resize", resize);

  animate();
}

window.scene3dReady = canvas
  ? init().catch((error) => {
      console.error("scene3d", error);
    })
  : Promise.resolve();
