<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- <popup
      class="pop"
      :style="{ left: item.left, top: pitem.top }"
      :item="item"
      v-for="(item, index) in pointList"
      :key="index"
      @click.native="popupClick(item)"
    ></popup> -->
    <popup
      class="pop"
      :style="{ left: pitem.left, top: pitem.top }"
      :item="pitem"
      v-show="pitem.show"
      @click.native="popupClick(pitem)"
    ></popup>
    <div class="mlant" v-show="showMLant">
      {{ mlat }},{{ mlnt }},{{ mheight }}
    </div>

    <div class="popup-jh" v-if="showMorePoint">
      <div class="congruentPoint">
        <span>聚合点</span>
        <i class="iconfont iconguanbi1 icon-jh" @click="clickPoint"></i>
      </div>

      <ul style="max-height: 400px; overflow: auto">
        <li
          v-for="item in morePoint"
          :key="item.id"
          @click="pointClickList(item)"
        >
          {{ item.name }} {{ " ( " + item.properties.ptcd["_value"] + " )" }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import widget from "cesium/Widgets/widgets.css";
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import popup from "@/components/_cesium/popup.vue";
import SuperGif from "libgif";

export default {
  name: "CesiumScene",
  props: {
    showMLant: {
      type: Boolean,
      default: true,
    },
  },
  components: { BigDataBox1, popup },
  data() {
    return {
      mlat: 0,
      mlnt: 0,
      mheight: 0,
      pitem: { left: 0, top: 0, show: false },
      viewer: {},
      layersUrl: "'http://127.0.0.1/Tiles_BIGEMAP/{z}/{x}/{y}.png",
      demUrl: "/map/dem9/",
      dsm: {
        url: "threemodal/b20200827-3.glb",
        // url: 'threemodal/20210223.glb',
        position: { x: 115.879192319, y: 31.66929273, z: 140 },
        rotate: { x: 89, y: 0.0, z: 0.0 },
        scale: 1,
      },
      camera: {
        position: { x: 115.879192319, y: 31.67929273, z: 300 },
        up: 150,
        rotate: { x: 180, y: 0.0, z: 0.0 },
      },
      offset: {
        up: { x: -0.079, y: -0.089, z: -150 },
        db: { x: 0, y: 0, z: 0 },
      },
      glbentity: {},
      pointList: [],
      removeListener: "",
      showMorePoint: false,
      morePoint: [],
    };
  },
  mounted() {
    this.viewerinit(); //初始化窗口
    // this.addGlb(this.dsm); //添加一个glb格式的实体
    // this.flyto();
    //this.getallcx();
    setTimeout(() => {
      this.addGlb(this.dsm);
    }, 2000);
  },
  beforeDestroy() {},
  methods: {
    viewerinit() {
      var that = this;
      let viewerOption = {
        geocoder: true, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: false, // 底图切换控件
        animation: false, // 控制场景动画的播放速度控件
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: that.demUrl,
          requestVertexNormals: true,
        }),
        //sceneMode: Cesium.SceneMode.SCENE2D,
        selectionIndicator: false, //关闭绿色的方框
        infoBox: false, //关闭原生的弹窗
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: that.layersUrl,
        }),
      };

      window.viewer = new Cesium.Viewer("cesiumContainer", viewerOption);
      window.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

      window.viewer.scene.globe.depthTestAgainstTerrain = true; ////重要  固定物体在位置上

      window.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; //限制地图浏览范围的观看最低高度

      //移除鼠标双击事件,防止双击锁定视角
      window.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );

      // that.addMerter()

      var handler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );

      handler.setInputAction(function (movement) {
        var pick = window.viewer.scene.pick(movement.position);

        // 获取3d位置
        // var worldPosition = window.viewer.scene.pickPosition(movement.position);
        // var worldPosition1 = window.viewer.camera.pickEllipsoid(
        //   movement.position
        // );
        // var cartographic =
        //   window.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        //     worldPosition1
        //   );

        // var lon = Cesium.Math.toDegrees(cartographic.longitude);
        // var lat = Cesium.Math.toDegrees(cartographic.latitude);
        // var elev = window.viewer.scene.globe.getHeight(cartographic);
        // console.log(lon, lat, elev);

        if (Cesium.defined(pick)) {
          if (pick.id.data) {
            that.$emit("popupClick", pick.id.data);
          } else if (pick.id.length > 1) {
            that.morePoint = pick.id;
            that.showMorePoint = true;
          }
        }

        if (that.$route.path === "/systemManage/system/buildings") {
          that.$message.success("已获取当前坐标信息");
          //查看当前视角的 x,y,z,heading,pitch,roll值
          //获取相机视角和位置
          var cartographic = window.viewer.scene.camera.positionCartographic;
          var x = Cesium.Math.toDegrees(cartographic.longitude);
          var y = Cesium.Math.toDegrees(cartographic.latitude);
          var z = Number(
            window.viewer.scene.camera.positionCartographic.height.toFixed(0)
          );
          var h = Number(
            Cesium.Math.toDegrees(window.viewer.scene.camera.heading).toFixed(2)
          );
          var p = Number(
            Cesium.Math.toDegrees(window.viewer.scene.camera.pitch).toFixed(2)
          );
          var r = Number(
            Cesium.Math.toDegrees(window.viewer.scene.camera.roll).toFixed(2)
          );
          that.$parent.positionData = {
            x: x,
            y: y,
            z: z,
            rx: h,
            ry: p,
            rz: r,
          };
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // handler.setInputAction((click) => {
      //   //查看当前视角的 x,y,z,heading,pitch,roll值
      //   var e = click;
      //   var position = window.viewer.scene.pickPosition(e.position);
      //   //获取相机视角和位置
      //   var cartographic = window.viewer.scene.camera.positionCartographic;
      //   var x = Cesium.Math.toDegrees(cartographic.longitude);
      //   var y = Cesium.Math.toDegrees(cartographic.latitude);
      //   var z = Number(
      //     window.viewer.scene.camera.positionCartographic.height.toFixed(0)
      //   );
      //   var h = Number(
      //     Cesium.Math.toDegrees(window.viewer.scene.camera.heading).toFixed(2)
      //   );
      //   var p = Number(
      //     Cesium.Math.toDegrees(window.viewer.scene.camera.pitch).toFixed(2)
      //   );
      //   var r = Number(
      //     Cesium.Math.toDegrees(window.viewer.scene.camera.roll).toFixed(2)
      //   );
      //   this.$parent.addPositionData = {
      //     x: x,
      //     y: y,
      //     z: z,
      //     rx: h,
      //     ry: p,
      //     rz: r,
      //   };
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      var handlermove = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );

      // 鼠标移动显示
      handlermove.setInputAction(function (movement) {
        var pick = window.viewer.scene.pick(movement.endPosition);

        // var worldPosition = window.viewer.scene.pickPosition(
        //   movement.endPosition
        // );
        var worldPosition1 = window.viewer.camera.pickEllipsoid(
          movement.endPosition
        );
        // 避免控制台报错,所以加个if条件判断
        if (worldPosition1 !== undefined) {
          var cartographic =
            window.viewer.scene.globe.ellipsoid.cartesianToCartographic(
              worldPosition1
            );
          cartographic.longituden = (cartographic.longitude / Math.PI) * 180;
          cartographic.latitude = (cartographic.latitude / Math.PI) * 180;

          that.mlat = cartographic.latitude;
          that.mlnt = cartographic.longituden;
          that.mheight = cartographic.height;
        } else {
          that.mlat = 0;
          that.mlnt = 0;
          that.mheight = 0;
        }
        // 原先的判断是只要移出就不显示
        if (Cesium.defined(pick)) {
          if (pick.id.code == "cesiumVal") {
            that.pitem = pick.id.data;

            that.$set(that.pitem, "top", movement.endPosition.y + 20 + "px");
            that.$set(that.pitem, "left", movement.endPosition.x + "px");
            that.$set(that.pitem, "show", true);
          } else {
            that.$set(that.pitem, "show", false);
          }
        } else {
          that.$set(that.pitem, "show", false);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    addGlb(glb) {
      var position = Cesium.Cartesian3.fromDegrees(
        glb.position.x + this.offset.db.x,
        glb.position.y + this.offset.db.y,
        glb.position.z + this.offset.db.z
      );
      var heading = Cesium.Math.toRadians(glb.rotate.x);
      var pitch = Cesium.Math.toRadians(glb.rotate.y);
      var roll = Cesium.Math.toRadians(glb.rotate.z);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(heading, pitch, roll)
      );

      this.glbentity = window.viewer.entities.add({
        id: "main",
        position: position,
        orientation: orientation,
        model: {
          uri: glb.url,
          scale: glb.scale,
        },
      });
    },
    /*addMerter(){
        /!**
         * 动态扩散圆纹理
         * @param {} color 颜色
         * @param {} duration 持续时间毫秒
         **!/
        function EllipsoidFadeMaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }

        Object.defineProperties(EllipsoidFadeMaterialProperty.prototype, {
            isConstant: {
                get: function () {
                    return false
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        EllipsoidFadeMaterialProperty.prototype.getType = function (time) {
            return 'EllipsoidFade';
        }
        EllipsoidFadeMaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.ColorWHITE, result.color);
            result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        EllipsoidFadeMaterialProperty.prototype.equals = function (other) {
            return this === other ||
                (other instanceof EllipsoidFadeMaterialProperty && Cesium.Property.equals(this._color, other._color))
        }
        Cesium.EllipsoidFadeMaterialProperty = EllipsoidFadeMaterialProperty;

        Cesium.Material.EllipsoidFadeType = "EllipsoidFade";
        // 自定义着色器
        Cesium.Material.EllipsoidFadeSource =
            "czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
            "{\n" +
            "  czm_material material = czm_getDefaultMaterial(materialInput);\n" +
            "  material.diffuse = 1.5 * color.rgb;\n" +
            "  vec2 st = materialInput.st;\n" +
            "  float dis = distance(st, vec2(0.5, 0.5));\n" +
            "  float per = fract(time);\n" +
            "  if(dis > per * 0.5) {\n" +
            "    material.alpha = 0.0;\n" +
            "    discard;\n" +
            "  }else{\n" +
            "    material.alpha = color.a * dis / per / 1.0;\n" +
            "  }\n" +
            "  return material;\n"+
            "}";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeType, {
            fabric: {
                type: Cesium.Material.EllipsoidFadeType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 1),
                    time: 0
                },
                source: Cesium.Material.EllipsoidFadeSource

            },
            translucent: function (material) {
                return true;
            }

        })
    },*/
    addpoint(pointList, zoomto) {
      if (!pointList) {
        return false;
      }
      var that = this;
      // if (pointList[0].sttp === "st_pp") {
      //   that.waterRainWord(pointList);
      // }

      that.pointList = pointList;
      var dataSources = window.viewer.dataSources._dataSources;
      if (dataSources.length > 0) {
        for (var i = 0, len = dataSources.length; i < len; i++) {
          window.viewer.dataSources.remove(dataSources[i]);
        }
      }

      let arr = { type: "FeatureCollection", features: [] };
      // 过滤掉没有经纬度的点  测试用 debugger
      that.pointList = that.pointList.filter((item) => {
        return item.lnt && item.lat;
      });
      that.pointList.forEach((item) => {
        let obj = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(item.lat),
              parseFloat(item.lnt),
              parseFloat(item.el) || 0,
            ],
          },
          properties: item,
        };
        arr["features"].push(obj);
      });

      var options = {
        camera: window.viewer.scene.camera,
        canvas: window.viewer.scene.canvas,
      };

      var dataSourcePromise = window.viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(arr, options)
      );
      dataSourcePromise.then(function (dataSource) {
        for (
          var i = 0, dLen = dataSource.entities.values.length;
          i < dLen;
          i++
        ) {
          let proper = dataSource.entities.values[i].properties;

          dataSource.entities.values[i].code = "cesiumVal";
          dataSource.entities.values[i].name = proper.ptnm["_value"]
            ? proper.ptnm["_value"]
            : proper.ptcd["_value"];
          dataSource.entities.values[i].data = proper;

          dataSource.entities.values[i].label = {};
          if (proper.sttp["_value"] === "st_pp") {
            dataSource.entities.values[i].label.text = proper.ptnm["_value"]
              ? proper.ptnm["_value"] +
                "(" +
                proper.ptcd["_value"] +
                ")" +
                "\n" +
                proper.pointLabelLists["_value"][0].mainTitle +
                (proper.pointLabelLists["_value"][0].mainVal === null
                  ? ""
                  : proper.pointLabelLists["_value"][0].mainVal) +
                (proper.pointLabelLists["_value"][0].mainUnit === null
                  ? ""
                  : proper.pointLabelLists["_value"][0].mainUnit)
              : proper.ptcd["_value"] +
                "\n" +
                proper.pointLabelLists["_value"][0].mainTitle;
          } else if (proper.sttp["_value"] === "st_zq") {
            let info = "";

            proper.pointLabelLists["_value"].forEach((el) => {
              info +=
                "\n" +
                el.mainTitle +
                (el.mainVal === null ? "" : el.mainVal) +
                (el.mainUnit === null ? "" : el.mainUnit);
            });
            dataSource.entities.values[i].label.text =
              proper.ptnm["_value"] + "(" + proper.ptcd["_value"] + ")" + info;
          } else if (proper.sttp["_value"] === "st_rr") {
            let infos = "";
            proper.pointLabelLists["_value"].forEach((el) => {
              infos +=
                "\n" +
                el.mainTitle +
                (el.mainVal === null ? "" : el.mainVal) +
                (el.mainUnit === null ? "" : el.mainUnit);
            });
            dataSource.entities.values[i].label.text =
              proper.ptnm["_value"] + "(" + proper.ptcd["_value"] + ")" + infos;
          } else if (proper.sttp["_value"] === "38") {
            // '38'表示的是视频监控
            dataSource.entities.values[i].billboard.image =
              "/images/iconimg/00ff00/iconvideo.png";
            dataSource.entities.values[i].label.text = proper.ptnm["_value"];
          } else {
            dataSource.entities.values[i].label.text = proper.ptnm["_value"]
              ? proper.ptnm["_value"] + "(" + proper.ptcd["_value"] + ")"
              : proper.ptcd["_value"];
          }

          dataSource.entities.values[i].label.font = "500 12px"; // 15pt monospace
          // dataSource.entities.values[i].label.font = '500 12px Helvetica' // 15pt monospace
          dataSource.entities.values[i].label.scale = 1;
          dataSource.entities.values[i].label.style = Cesium.LabelStyle.FILL;
          dataSource.entities.values[i].label.pixelOffset =
            new Cesium.Cartesian2(10, -10); //偏移量
          dataSource.entities.values[i].label.showBackground = true;
          dataSource.entities.values[i].label.backgroundColor =
            new Cesium.Color(0.5, 0.6, 1, 0);
          dataSource.entities.values[i].label.disableDepthTestDistance =
            Number.POSITIVE_INFINITY;
          dataSource.entities.values[i].label.verticalOrigin =
            Cesium.VerticalOrigin.CENTER; //垂直位置
          dataSource.entities.values[i].label.horizontalOrigin =
            Cesium.HorizontalOrigin.LEFT; //水平位置

          if (proper.subMstColor && proper.subMstColor["_value"]) {
            dataSource.entities.values[i].label.fillColor =
              new Cesium.Color.fromCssColorString(proper.subMstColor["_value"]);
            if (pointList[0].wrrm) {
              const gif = [];
              let url =
                "../images/svg/" +
                proper.subMstColor["_value"].replace("#", "") +
                ".gif";
              let speed = 4;
              that.loadGif(url, gif);

              dataSource.entities.values[i].billboard.image =
                new Cesium.CallbackProperty(() => {
                  if (gif.length) {
                    if (i < speed * (gif.length - 1)) {
                      i++;
                    } else {
                      i = 0;
                    }
                    return gif[Math.floor(i / speed)];
                  } else {
                    return url;
                  }
                }, false);

              /*dataSource.entities.values[i].ellipse = {};
              dataSource.entities.values[i].ellipse.height = parseFloat(dataSource.entities.values[i].properties.el['_value']);
              dataSource.entities.values[i].ellipse.semiMinorAxis = 50;
              dataSource.entities.values[i].ellipse.semiMajorAxis = 50;
              dataSource.entities.values[i].ellipse.material = new Cesium.EllipsoidFadeMaterialProperty(Cesium.Color.ORANGE, 2000);
              dataSource.entities.values[i].ellipse.show = true;*/
            } else {
              dataSource.entities.values[i].billboard.image =
                "/images/iconimg/" +
                proper.subMstColor["_value"].replace("#", "") +
                "/" +
                proper.icimg["_value"] +
                ".png";
            }
          } else {
            dataSource.entities.values[i].label.fillColor =
              new Cesium.Color.fromCssColorString("#00ff00");
            dataSource.entities.values[i].billboard.image =
              "/images/iconimg/00ff00/" + proper.icimg["_value"] + ".png";
          }
          dataSource.entities.values[i].billboard.disableDepthTestDistance =
            Number.POSITIVE_INFINITY;
          dataSource.entities.values[i].billboard.width = 24;
          dataSource.entities.values[i].billboard.height = 24;

          // 如果时水雨情-雨量站 则直接显示详情
          // if (proper.sttp['_value'] === 'st_pp') {
          //   let desc = proper.pointLabelLists['_value']
          //   for (let j = 0; j < desc.length; j++) {
          //     dataSource.entities.values[i].label.text += `\n${desc[i].mainTitle} ${desc[i].mainVal}`
          //     if (desc[i].subTitle) {
          //       dataSource.entities.values[i].label.text += `( ${desc[i].subTitle} ${desc[i].subVal} )`
          //     }
          //   }
          // }

          // if(proper.sttp['_value'] === 'st_pp') {
          //   that.waterRainWord(proper)
          // }
        }

        var pixelRange = 10;
        var minimumClusterSize = 2;
        var enabled = true;

        dataSource.clustering.enabled = enabled;
        dataSource.clustering.pixelRange = pixelRange;
        dataSource.clustering.minimumClusterSize = minimumClusterSize;

        that.customStyle(dataSource);
        if (zoomto) {
          window.viewer.flyTo(dataSource, {
            offset: {
              heading: 160,
              pitch: Cesium.Math.toRadians(-25),
              range: 0,
            },
          });
        }
      });
    },
    waterRainWord(val) {
      // let Cesium = this.cesium;
      // 文字;
      window.viewer.entities.add({
        id: "words",
        position: new Cesium.Cartesian3.fromDegrees(
          // parseFloat(val.lat["_value"]),
          // parseFloat(val.lnt["_value"]),
          // parseFloat(val.el["_value"]),
          115.76,
          31.461174,
          0
        ),

        label: {
          // 文本。支持显式换行符“ \ n”

          // text: "测试\n名称",
          text: "测试",

          // 字体样式，以CSS语法指定字体

          font: "12pt Source Han Sans CN",

          // 字体颜色

          fillColor: Cesium.Color.AQUAMARINE,

          // 背景颜色transparent

          // backgroundColor: Cesium.Color.TRANSPARENT,
          backgroundColor: Cesium.Color.fromCssColorString(
            "rgba(7, 77, 155, 0.45)"
          ),
          // backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.8),

          backgroundPadding: new Cesium.Cartesian2(40, 10),
          backgroundBorder: 10,

          // 是否显示背景颜色

          showBackground: true,

          // 字体边框

          outline: false,

          // 字体边框颜色

          // outlineColor: Cesium.Color.BLACK,

          // 字体边框尺寸

          outlineWidth: 0,

          // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。

          scale: 1.0,

          // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。

          style: Cesium.LabelStyle.FILL_AND_OUTLINE,

          // 相对于坐标的水平位置

          verticalOrigin: Cesium.VerticalOrigin.CENTER,

          // 相对于坐标的水平位置

          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,

          // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量

          pixelOffset: new Cesium.Cartesian2(-10, 30),

          // 是否显示

          show: true,
        },
      });
    },
    customStyle(dataSource) {
      var removeListener;

      var pinBuilder = new Cesium.PinBuilder();
      var pin50 = pinBuilder
        .fromText("50+", Cesium.Color.YELLOWGREEN, 48)
        .toDataURL();
      var pin40 = pinBuilder
        .fromText("40+", Cesium.Color.YELLOWGREEN, 48)
        .toDataURL();
      var pin30 = pinBuilder
        .fromText("30+", Cesium.Color.YELLOWGREEN, 48)
        .toDataURL();
      var pin20 = pinBuilder
        .fromText("20+", Cesium.Color.YELLOWGREEN, 48)
        .toDataURL();
      var pin10 = pinBuilder
        .fromText("10+", Cesium.Color.YELLOWGREEN, 48)
        .toDataURL();

      var singleDigitPins = new Array(8);
      for (var i = 0; i < singleDigitPins.length; ++i) {
        singleDigitPins[i] = pinBuilder
          .fromText("" + (i + 2), Cesium.Color.YELLOWGREEN, 48)
          .toDataURL();
      }
      if (Cesium.defined(removeListener)) {
        removeListener();
        removeListener = undefined;
      } else {
        removeListener = dataSource.clustering.clusterEvent.addEventListener(
          function (clusteredEntities, cluster) {
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.id = cluster.label.id;
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            cluster.billboard.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
            cluster.billboard.disableDepthTestDistance = 200;
            //cluster.billboard.height = 150

            if (clusteredEntities.length >= 50) {
              cluster.billboard.image = pin50;
            } else if (clusteredEntities.length >= 40) {
              cluster.billboard.image = pin40;
            } else if (clusteredEntities.length >= 30) {
              cluster.billboard.image = pin30;
            } else if (clusteredEntities.length >= 20) {
              cluster.billboard.image = pin20;
            } else if (clusteredEntities.length >= 10) {
              cluster.billboard.image = pin10;
            } else {
              cluster.billboard.image =
                singleDigitPins[clusteredEntities.length - 2];
            }
          }
        );
      }

      // force a re-cluster with the new styling
      var pixelRange = dataSource.clustering.pixelRange;
      dataSource.clustering.pixelRange = 0;
      dataSource.clustering.pixelRange = pixelRange;
    },
    flytopoint(ptr) {
      this.camera.position.x = parseFloat(ptr.x);
      this.camera.position.y = parseFloat(ptr.y);
      this.camera.position.z = parseFloat(ptr.z);
      this.camera.rotate.x = parseFloat(ptr.rx);
      this.camera.rotate.y = parseFloat(ptr.ry);
      this.camera.rotate.z = parseFloat(ptr.rz);
      this.flyto();
    },
    flyto() {
      window.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z
        ), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(this.camera.rotate.x), // 方向y
          pitch: Cesium.Math.toRadians(this.camera.rotate.y), // 倾斜角度
          roll: Cesium.Math.toRadians(this.camera.rotate.z), // 倾斜角度z
        },
        duration: 2, // 设置飞行持续时间，默认会根据距离来计算
        complete: function () {
          // 到达位置后执行的回调函数
        },
        cancle: function () {
          // 如果取消飞行则会调用此函数
        },
        pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        maximumHeight: 4000, // 相机最大飞行高度
        //flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
      });
    },

    popupClick(item) {
      this.$emit("popupClick", item);
    },
    icon2img(iconu, iconc) {
      var canvas = document.createElement("canvas");
      var content = document.createElement("span");
      content.className = "icon iconfont";
      content.innerHTML = iconu;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = iconc; //颜色
      ctx.font = "48px IconFont";
      ctx.fillText(content.textContent, 48, 48);
      return canvas.toDataURL();
    },
    clickPoint() {
      this.showMorePoint = false;
    },
    pointClickList(data) {
      this.$emit("popupClick", data.data);
    },
    loadGif(url, imageArr = []) {
      const img = document.createElement("img");
      img.src = url;
      // gif库需要img标签配置下面两个属性
      img.setAttribute("rel:animated_src", url);
      img.setAttribute("rel:auto_play", "0");
      document.body.appendChild(img);
      // 新建gif实例
      const rub = new SuperGif({ gif: img });
      return new Promise((resolve) => {
        rub.load(() => {
          for (let i = 1; i <= rub.get_length(); i++) {
            // 遍历gif实例的每一帧
            rub.move_to(i);
            imageArr.push(rub.get_canvas().toDataURL());
          }
          resolve(imageArr);
          // document.body.removeChild(img)
        });
      });
    },
    addLine(sp, ep, color) {
      var entity = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            sp.lat,
            sp.lnt,
            sp.el,
            ep.lat,
            ep.lnt,
            ep.el,
          ]),
          width: 5,
          material: new Cesium.PolylineArrowMaterialProperty(color),
        },
      });
    },
    // 黄色箭头
    getallcx(type) {
      //  var sp = { lat: 115.8796012014147, lnt: 31.66948004886723, el: 153.1749124482022 }
      // var ep = { lat: 115.8796908014147, lnt: 31.66950994886723, el: 153.1749124482022 }
      var color = new Cesium.Color(255, 255, 0, 1);
      var that = this;
      // this.addLine(sp, ep, color)
      this.$http.get("/rsvrApi/pub/getippl?type=" + type).then(function (r) {
        r.data.data.forEach(function (item, i) {
          let sp = { lat: item.LAT, lnt: item.LNT, el: item.EL };
          let ep = { lat: item.LAT_1, lnt: item.LNT_1, el: item.EL_1 };
          that.addLine(sp, ep, color);
        });
      });
    },
    // cesium  html测试
    test() {
      var canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;

      var svgString =
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px; color: #FF0">' +
        '<span style="color:white; text-shadow:0 0 2px blue;">Cupcakes</span>' +
        "</div>" +
        "</foreignObject>" +
        "</svg>";

      var image = new Image();
      image.src = "data:image/svg+xml;base64," + window.btoa(svgString);

      //Need to wait for image to load before proceeding to draw
      image.onload = function () {
        canvas.getContext("2d").drawImage(image, 0, 0);

        window.viewer.entities.add({
          id: "Cupcake SVG",
          position: Cesium.Cartesian3.fromDegrees(
            115.87957607930088,
            31.669443592505054,
            112.79232273058405
          ),
          billboard: {
            image: canvas,
          },
          description: "<p>This is a cupcake that can be modified.</p>",
        });
      };
    },
    getCartographic() {
      //查看当前视角的 x,y,z,heading,pitch,roll值
      //获取相机视角和位置
      var cartographic = window.viewer.scene.camera.positionCartographic;
      var x = Cesium.Math.toDegrees(cartographic.longitude);
      var y = Cesium.Math.toDegrees(cartographic.latitude);
      var z = Number(
        window.viewer.scene.camera.positionCartographic.height.toFixed(0)
      );
      var h = Number(
        Cesium.Math.toDegrees(window.viewer.scene.camera.heading).toFixed(2)
      );
      var p = Number(
        Cesium.Math.toDegrees(window.viewer.scene.camera.pitch).toFixed(2)
      );
      var r = Number(
        Cesium.Math.toDegrees(window.viewer.scene.camera.roll).toFixed(2)
      );
      this.$parent.addPositionData = {
        x: x,
        y: y,
        z: z,
        rx: h,
        ry: p,
        rz: r,
      };
    },
  },
};
</script>

<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  z-index: 1;
  position: absolute;
}

#set {
  position: absolute;
  z-index: 2;
  background-color: #fff;
}

.mlant {
  position: absolute;
  left: 20px;
  bottom: 20px;
  font-size: 12px;
  color: #fff;
  // z-index: 9999;
  z-index: 99;
}

.popup-jh {
  width: 200px;
  position: absolute;
  z-index: 999;
  background: rgba(40, 73, 133, 0.8);
  top: 45%;
  left: 45%;
  color: #fff;
  border: 1px solid #609bef;
  border-radius: 8px;

  .congruentPoint {
    padding: 0 15px;
    box-sizing: border-box;
  }
  ul {
    padding: 5px 10px;
  }
}
.popup-jh div {
  border-bottom: 1px solid #609bef;
}

.popup-jh li {
  padding: 5px 10px;
  box-sizing: border-box;
  cursor: pointer;
}

.popup-jh span {
  width: 100%;
  height: 50px;
  line-height: 50px;
}

.icon-jh {
  font-size: 48px;
  right: 5px;
  top: 0px;
  display: block;
  position: absolute;
  cursor: pointer;
}
/deep/.cesium-viewer-toolbar {
  display: none;
}
</style>
