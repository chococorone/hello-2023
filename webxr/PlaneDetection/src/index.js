//import * as THREE from "https://unpkg.com/three@0.113.2/build/three.module.js";
import * as THREE from "three";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { OculusHandModel } from "three/addons/webxr/OculusHandModel.js";
import { XRPlanes } from "three/addons/webxr/XRPlanes.js";

const width = window.innerWidth;
const height = window.innerHeight;

let camera, scene, renderer;
let group, box;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
  camera.position.set(0, 1.0, 0.5);

  //表示するオブジェクト
  group = new THREE.Group();
  scene.add(group);
  box = new THREE.Mesh(
    //new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
    //new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.SphereGeometry(0.1, 0.1, 0.1),
    //new THREE.MeshNormalMaterial()
    new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      roughness: 0.7,
      metalness: 0.0,
    })
  );
  box.position.set(0.0, 1.0, -0.5);
  box.name = "testbox";
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);

  //ライトの設定
  //scene.add(new THREE.HemisphereLight(0xbbbbbb, 0x888888, 3));
  scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  //グリッドの設定
  const axes = new THREE.AxesHelper(1);
  axes.position.set(0.0, 1.0, -0.5);
  scene.add(axes);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setAnimationLoop(onDrawAnimation);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["plane-detection"],
    })
  );

  const planes = new XRPlanes(renderer);
  scene.add(planes);
}
//描画のためにループする。setanimationloopでコールバックとして登録される
function onDrawAnimation(time, xrFrame) {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  renderer.render(scene, camera);
}
