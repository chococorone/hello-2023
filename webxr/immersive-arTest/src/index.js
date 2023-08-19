//import * as THREE from "https://unpkg.com/three@0.113.2/build/three.module.js";
import * as THREE from "three";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRButton } from "three/addons/webxr/XRButton.js";

const width = window.innerWidth;
const height = window.innerHeight;
const $button = document.getElementById("startButton");

let camera, scene, renderer;

(async () => {
  let isControllerConnectedLeft = false;
  let isControllerConnectedRight = false;
  let isSmartphoneScreenPressed = false;
  const device = {
    smartphone: 1,
    hmd: 2,
  };
  let mode = undefined;

  if (navigator.xr) {
    console.log("test");
    const isInlineSupported = await navigator.xr.isSessionSupported(
      "immersive-ar"
    );
    console.log(isInlineSupported);
    $button.disabled = !isInlineSupported;
  }

  $button.addEventListener("click", enterAR);
  async function enterAR() {
    $button.style.display = "none";

    const xrSession = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["local", "hit-test"],
      optionalFeatures: [
        "local-floor",
        "bounded-floor",
        "hand-tracking",
        "layers",
      ],
    });
    console.log(xrSession);

    // three.jsを用いてwebgl layerに3dboxを追加している
    renderer = new THREE.WebGLRenderer({
      canvas: xrCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.autoClear = false;
    renderer.setSize(width, height);
    //rendererでの描画を試す
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(drawAnimation);
    renderer.xr.enabled = true;

    //setsessionが必要だった！
    await renderer.xr.setSession(xrSession);

    const gl = renderer.getContext();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();

    // matrixの自動再計算 camera.updateMatrixWorldみたいにカメラとの映像をくっつけるところで手動でやるので不要
    camera.matrixAutoUpdate = false;

    //光源の設定
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    const light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    //コントローラーの準備
    //コントローラーの取得
    function settingController(index) {
      const controller = renderer.xr.getController(index);
      if (index === 0) {
        controller.name = "left controller";
      } else {
        controller.name = "right controller";
      }
      controller.addEventListener("connected", function (event) {
        console.log(event);
        this.add(buildController(event.data));
        if (index === 0) {
          isControllerConnectedLeft = true;
        } else {
          isControllerConnectedRight = true;
        }
      });
      controller.addEventListener("selectstart", onSelectStart);
      controller.addEventListener("selectend", onSelectEnd);
      controller.addEventListener("disconnected", function () {
        this.remove(this.children[0]);
      });
    }
    const controller0 = settingController(0);
    const controller1 = settingController(1);

    scene.add(controller0);
    scene.add(controller1);

    console.log("controller");
    console.log(controller0);
    console.log(controller1);
    console.log("xr");
    console.log(renderer.xr);

    const controllerModelFactory = new XRControllerModelFactory();
    console.log(controllerModelFactory);
    const controllerGrip0 = renderer.xr.getControllerGrip(0);
    controllerGrip0.add(
      controllerModelFactory.createControllerModel(controllerGrip0)
    );
    const controllerGrip1 = renderer.xr.getControllerGrip(1);
    controllerGrip1.add(
      controllerModelFactory.createControllerModel(controllerGrip1)
    );
    console.log("controller grip");
    console.log(controllerGrip0);
    console.log(controllerGrip1);
    scene.add(controllerGrip0);
    scene.add(controllerGrip1);
    console.log(scene);

    //平面の表示 //原点はカメラ位置に表示される。
    const grid = new THREE.GridHelper(10, 100);
    grid.position.set(0, 0.5, 0);
    //scene.add(grid);

    //x,y,z軸の表示
    const axes = new THREE.AxesHelper(1);
    axes.position.set(0, 0.5, -0.5);
    scene.add(axes);

    //グループの準備
    const group = new THREE.Group();
    scene.add(group);

    const box = new THREE.Mesh(
      //new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      //new THREE.MeshNormalMaterial()
      new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0,
      })
    );
    box.position.set(0.0, 1.0, -0.5);
    box.castShadow = true;
    box.receiveShadow = true;
    //scene.add(box);
    group.add(box);

    //デバイスの姿勢の参照先を作る
    const referenceSpace = await xrSession.requestReferenceSpace("local");

    /* 外の風景とthreejsのレイヤを重ねるやり方？ //google codelabで同様の実装法をしている //threejsの場合でも内部でやってる？
    // カメラ画像を受け取るベースレイヤーを設定
    const xrWebGLLayer = new XRWebGLLayer(xrSession, gl);
    xrSession.updateRenderState({ baseLayer: xrWebGLLayer });


    //描画ループを開始する
    xrSession.requestAnimationFrame(onDrawFrame);

    var count = 0;
    function onDrawFrame(timestamp, xrFrame) {
      xrSession.requestAnimationFrame(onDrawFrame);
      count += 1;

      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      // --- 現実風景の描画用 ---- //
      //姿勢を取り出す
      const pose = xrFrame.getViewerPose(referenceSpace);
      if (!pose) return;

      //現実の風景をwebglのフレームバッファーに転写する
      gl.bindFramebuffer(gl.FRAMEBUFFER, xrWebGLLayer.framebuffer);

      //xrsessionが両目用(HMD用？)の場合は2つの画面のレンダリングのためにpose.viewsに2つのviewオブジェクトが入っている！
      pose.views.forEach((view) => {
        //右目、左目で別々の大きさと座標でviewportとして設定している
        const viewport = xrWebGLLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        renderer.clearDepth();
        renderer.render(scene, camera);
      });
    }
    */

    function buildController(data) {
      console.log("build controller");
      console.log(data);
      let geometry, material;
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
      );
      material = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      line.name = "line";

      switch (data.targetRayMode) {
        case "tracked-pointer":
          console.log("connected");
          console.log(line);
          //仮でコントローラーをもとに処理を分けているがもっといい方法あるはず
          mode = device.hmd;
          return line;
        case "gaze":
          geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
          material = new THREE.MeshBasicMaterial({
            opacity: 0.5,
            transparent: true,
          });
          return new THREE.Mesh(geometry, material);
        case "screen":
          mode = device.smartphone;
          return line;
      }
    }

    //レイと交差しているシェイプの一覧
    const intersected = [];
    function cleanIntersected() {
      while (intersected.length) {
        const object = intersected.pop();
        object.material.emissive.r = 0;
      }
    }

    function intersectObjects(controller) {
      if (controller.userData !== undefined) return;
      if (controller.userData.selected !== undefined) return;

      const line = controller.getObjectByName("line");
      const intersections = getIntersections(controller);
      if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        object.material.emissive.r = 1;
        intersected.push(object);
        line.scale.z = intersection.distance;
      } else {
        line.scale.z = 5;
      }
    }

    const tempMatrix = new THREE.Matrix4();
    const raycaster = new THREE.Raycaster();

    //controllerと重なっているオブジェクトを取得する
    function getIntersections(controller) {
      //identity() :単位行列の作成
      tempMatrix.identity().extractRotation(controller.matrixWorld); //向きの取得？
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld); //位置の取得？と反映
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix); //向きを反映？
      return raycaster.intersectObjects(group.children, false);
    }

    function onSelectStart(event) {
      console.log(this.name + "press");
      console.log(event);

      const controller = event.target;
      //targetRayModeによって別の処理をさせる
      switch (event.data.targetRayMode) {
        case "tracked-pointer":
          const intersections = getIntersections(controller);
          if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;
            object.material.emissive.b = 1;
            controller.attach(object);
            controller.userData.selected = object;
          }
        case "screen":
          isSmartphoneScreenPressed = true;
          const intersections_screen = getIntersections(camera);

          if (intersections_screen.length > 0) {
            const intersection = intersections_screen[0];
            const object = intersection.object;
            object.material.emissive.b = 1;
            controller.attach(object);
            controller.userData.selected = object;
            console.log(controller.userData.selected);
          }
      }
    }
    function onSelectEnd(event) {
      console.log(this.name + "release");
      console.log(event);
      const controller = event.target;
      if (controller.userData.selected !== undefined) {
        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        group.attach(object);
        controller.userData.selected = undefined;
      }
      switch (event.data.targetRayMode) {
        case "tracked-pointer":
          return;
        case "screen":
          isSmartphoneScreenPressed = false;
          return;
      }
    }

    function drawAnimation(timestamp, xrFrame) {
      //console.log("xrFrame");
      //console.log(xrFrame);
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      //画面からレイを出す実験
      //姿勢を取り出す
      const pose = xrFrame.getViewerPose(referenceSpace);
      if (!pose) return;
      const cameraPose = pose.views[0];

      if (mode == device.smartphone) {
        // 交差判定
        cleanIntersected();
        if (!isSmartphoneScreenPressed) {
          const intersections = getIntersections(camera);
          //console.log("intersections");
          //console.log(intersections);
          if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;
            object.material.emissive.r = 1;
            intersected.push(object);
          }
        }
      }

      if (mode == device.hmd) {
        //コントローラーのraycasterとobjectの接触判定
        if (isControllerConnectedLeft && isControllerConnectedRight) {
          cleanIntersected();
          intersectObjects(controller0);
          intersectObjects(controller1);
        }
      }

      renderer.render(scene, camera);
    }
  }
})();
