<template>
  <div style="height:100%">
    <div id="kuang"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default {
  name: "msthree",
  data: function () {
    return {
      defaultProps:{  children: 'children',
          label: 'name'},
      renderer: {},
      //渲染器对象
      camera: {},
      //相机对象
      scene: {},
      //场景对象
      light: {},
      pointLight:{},
      //平行光对象
      controls: {},
      //轨迹球对象
      dom: {},
      position: { x: 50, y: -55, z: -130 },
    };
  },
  mounted: function () {
    this.dom = document.getElementById("kuang");
    this.initRender();
    //创建渲染器
    this.initScene();
    //创建场景
    this.initCamera();
    //创建相机
    this.initLight();
    //创建光源
    //this.initModel();
    this.loadglf();

    //创建几何对象
    this.initControls();
    //创建轨迹球
    this.animate();
    //渲染
    window.onresize = this.onWindowResize;
    //监听窗体变化
  },
  methods: {
    xclick(val){this.position.x+=val;
      this.pointLight.position.set(this.position.x, this.position.y, this.position.z);
    },
        yclick(val){this.position.y+=val;
      this.pointLight.position.set(this.position.x, this.position.y, this.position.z);
    },
        zclick(val){this.position.z+=val;
      this.pointLight.position.set(this.position.x, this.position.y, this.position.z);
    },
    initRender: function () {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      // this.renderer = new THREE.WebGLRenderer({ antialias: true });
      //创建渲染器， antialias（是否启用抗锯齿）
      this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
      //设置渲染器尺寸 等于模块宽高
      this.dom.appendChild(this.renderer.domElement);
      //将渲染器添加到页面上
      this.renderer.setClearAlpha(0.0);
      //背景透明
    },
    initCamera: function () {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.dom.offsetWidth / this.dom.offsetHeight,
        1,
        10000
      );
      //创建 透视相机 视角45度 长宽比等于模块长宽比 近切面1 远切面10000
      this.camera.position.set(0, 180, -700);

      //偏移相机z轴400
      // this.camera.lookAt( this.scene.position);
    },
    initScene: function () {
      this.scene = new THREE.Scene();

      //创建场景对象
    },
    initLight: function () {
      this.scene.add(new THREE.AmbientLight(0x444444, 0.5));
      //向场景添加环境光
      this.light = new THREE.DirectionalLight(0x444444, 1); //缺省值光照强度 0 -1
      //创建平行光 常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
      this.light.position.set(1, 3, 2);
      //设置光源位置
      this.scene.add(this.light);
      //向场景添加平行光

      this.light1 = new THREE.DirectionalLight(0xffffff, 1); //缺省值光照强度 0 -1
      //创建平行光 常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
      this.light1.position.set(111, 113, 111);
      //设置光源位置
      //this.scene.add(this.light1);
      //向场景添加平行光
      this.light2 = new THREE.DirectionalLight(0xffffff, 1); //缺省值光照强度 0 -1
      //创建平行光 常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
      this.light2.position.set(1113, 3253, 553);
      //设置光源位置
      this.scene.add(this.light2);
      //向场景添加平行光

      this.pointLight = new THREE.PointLight(0x999999, 2, 0,1);
       this.pointLight.position.set(this.position.x, this.position.y, this.position.z);
      var pointLight1 = new THREE.PointLight(0x999999);
      pointLight1.position.set(113, 23, 13);
      var pointLight2 = new THREE.PointLight(0x999999, 50, 0, 1);
      pointLight2.position.set(113, 23, 13);
      this.scene.add( this.pointLight);
     // this.scene.add(pointLight1);
      // this.scene.add(pointLight2);
      var spotLight = new THREE.SpotLight(0xffffff, 1, 10, 90, 1, 0);
      spotLight.position.set(113, 153, 2853);
      //this.scene.add(spotLight);
    },
    loadtk() {
      var that = this;
      let gltf = new GLTFLoader();
      gltf.load("threemodal/tk.gltf", function (object3d) {
        //console.log(object3d.scene);
        object3d.scene.children[0].position.set(800, -803, -20);
        object3d.scene.children[0].scale.set(10, 10, 10);
        that.scene.add(object3d.scene.children[0]);
      });
    },
    loadglf() {
      this.loadtk();
      var that = this;
      let gltf = new GLTFLoader();
      gltf.load("threemodal/b20200827-3.glb", function (object3d) {
    
        object3d.scene.background = new THREE.CubeTextureLoader()
          .setPath("/skybox/")
          .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
          object3d.scene.children[0].material=
                new THREE.MeshBasicMaterial({color: 0xFFFFFF});
                    // object3d.scene.children[0].visible =false;
        that.scene.add(  object3d.scene);
      });
    },
    initControls: function () {
      this.controls = new TrackballControls(this.camera);
      //旋转速度
      this.controls.rotateSpeed = 5;
      //变焦速度
      this.controls.zoomSpeed = 3;
      //平移速度
      this.controls.panSpeed = 0.5;
      //是否不变焦
      this.controls.noZoom = false;
      //是否不平移
      this.controls.noPan = false;
      //是否开启移动惯性
      this.controls.staticMoving = false;
      //动态阻尼系数 就是灵敏度
      this.controls.dynamicDampingFactor = 0.3;
      //未知，占时先保留
      //controls.keys = [ 65, 83, 68 ];
      this.controls.addEventListener("change", this.render, { passive: false });

      //变化时触发渲染方法
    },
    render: function () {
      this.renderer.render(this.scene, this.camera);
      //  console.log(this.camera);
      //将场景相机渲染到页面
    },
    onWindowResize: function () {
      this.camera.aspect = this.dom.offsetWidth / this.dom.offsetHeight;
      //更新镜头长宽比
      this.camera.updateProjectionMatrix();
      //更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
      this.controls.handleResize();
      //轨迹球适应窗口的功能 文档没有查到相关 依样画葫芦
      this.render();
      //从新渲染
      this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
      //设置渲染器宽长
    },
    animate: function () {
      this.controls.update();
      //注意,调用了该方法,才有效果 依样画葫芦
      this.render();
      //渲染
      requestAnimationFrame(this.animate);
    },
    addpoint() {},
  },
};
</script>

<style scoped>
#kuang {
  width: 100%;
  height: 100%;
  background: url(/skybox/py.jpg) no-repeat center/cover;
  position:absolute;
  z-index: 1;
}
#button{
  position: absolute;
    width: 10%;
  height: 100%;
  left: 90%;
  z-index: 22222;
}
</style>