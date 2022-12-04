<template>
  <div class="videoSurveillance">
    <div id="map" v-loading="loading"></div>
    <div v-show="showVideo" :class="videoIndex == 0 ? 'selectVideo' : 'video'">
      <cus-player
        ref="video0"
        :showVideo="showVideo"
        @changeShowVideo="changeShowVideo"
      ></cus-player>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";
import { Text, Style, Fill, Circle } from "ol/style";
import VectorSource from "ol/source/Vector";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { loadImg } from "@/utils/dom";
import { uploadCamera, getCameraData } from "@/http/api";
import CusPlayer from "./CusPlayer";
export default {
  components: {
    CusPlayer,
  },
  data() {
    return {
      imgUrl: "http://220.180.11.124:8099/upload/qjt.png",
      loading: false,
      videoIndex: 0,
      baseUrl: "http://10.6.179.83:8866/live?url=",
      showVideo: false,
      features: [],
    };
  },
  created() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = "http://220.180.11.124:8866/live?url=";
      this.imgUrl = window.location.origin + "/upload/qjt.png";
    }
    this.loading = true;
    loadImg(this.imgUrl).then((img) => {
      let extent = [0, 0, img.width, img.height];
      this.init(extent);
    });
  },
  beforeDestroy() {
    window.olMap = null;
  },
  methods: {
    getData() {
      getCameraData().then((r) => {
        this.addPoint(r.data.data);
        this.loading = false;
      });
    },
    addPoint(data) {
      data.forEach((v) => {
        let coordinate = [v.x, v.y];
        let feature = new Feature({
          type: "iconvideo",
          id: v.id,
          url: v.rtspUrl,
          geometry: new Point(coordinate),
        });
        feature.setStyle(
          new Style({
            fill: new Fill({
              color: "yellow",
            }),
            image: new Circle({
              //半径大小
              radius: 3,
              //填充
              fill: new Fill({
                //填充颜色
                color: "#e81818",
              }),
            }),
            text: new Text({
              font: "15px Microsoft YaHei",
              text: v.name,
              offsetY: 3,
              offsetX: v.name.length * 9,
              rotation: 0.4,
              fill: new Fill({
                color: "#00ff00",
              }),
            }),
          })
        );
        this.features.push(feature);
      });
      let symbolLayer = window.olMap.getLayers().item(1);
      if (!symbolLayer.getSource()) {
        symbolLayer.setSource(
          new VectorSource({
            features: this.features,
          })
        );
      } else {
        symbolLayer.getSource().addFeatures(this.features);
      }
    },
    init(extent) {
      this.getData();
      const that = this;
      this.features = [];

      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });

      let symbolLayer = new VectorLayer();
      window.olMap = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              url: that.imgUrl,
              projection: projection,
              imageExtent: extent,
            }),
          }),
          symbolLayer,
        ],
        target: "map",
        view: new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 3.2,
          maxZoom: 8,
        }),
      });
      // 点击地图取坐标点
      window.olMap.on("click", function (evt) {
        // that.addPointToDb(evt.coordinate);
      });
      window.olMap.on("click", function (evt) {
        let feature = window.olMap.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );
        if (feature) {
          that.getVideo(feature.values_.url);
          that.showVideo = true;
        }
        // if (feature) {
        //   that.setInfoBox(feature, evt.pixel_, "click");
        // } else {
        //   that.hideInfoBox();
        // }
      });

      window.olMap.on("pointermove", function (evt) {
        let feature = window.olMap.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );
        // if (feature) {
        //   that.activeFeature = feature;
        //   that.$refs.infoBox.style.left = evt.pixel_[0] + 20 + "px";
        //   that.$refs.infoBox.style.top = evt.pixel_[1] + 50 + "px";
        //   that.$refs.infoBox.style.visibility = "visible";
        // } else {
        //   that.activeFeature = null;
        //   that.$refs.infoBox.style.visibility = "hidden";
        // }
      });
    },
    addPointToDb(val) {
      uploadCamera({
        id: 18,
        x: val[0],
        y: val[1],
      }).then((r) => {
        console.log(r);
      });
    },

    getVideo(url) {
      if (url) {
        let ref = "video" + this.videoIndex;
        this.$refs[ref].createPlayer(this.baseUrl + url, true, this.videoIndex);
      } else {
        this.$message.error("请填写播放地址");
      }
    },
    changeShowVideo(v) {
      this.showVideo = v;
    },
  },
};
</script>
<style lang='scss' scoped>
.videoSurveillance {
  #map {
    height: 100%;
  }
  .selectVideo {
    margin: auto;
    height: 100%;
    width: calc(100% - 280px);
    position: absolute;
    top: 0;
  }
  .video {
    margin: auto;
    border: solid 1px #55557f;
    height: 1100px;
    width: 700px;
    position: relative;
  }
}
</style>