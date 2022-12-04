<template>
  <!-- 安全监测布置图 -->
  <div class="generalLayout flex-col-layout">
    <el-form :inline="true" :model="form" class="form-style1" size="small">
      <el-form-item label="监测部位：">
        <!-- <el-select v-model="form.prnm" placeholder="请选择监测部位">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> -->

        <el-select
          v-model="form.prnm"
          placeholder="请选择监测部位"
          @change="changePart"
        >
          <el-option
            v-for="item in dataList"
            :key="item.cadId"
            :label="item.fileName"
            :value="item.cadId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="form.time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          @change="changeTime"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="getPoint">查询</el-button> -->
        <!-- <el-button @click="clear">清除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="flex-1" id="map" v-loading="loading"></div>
    <div class="legend-box">
      <div class="legend">图 例</div>
      <ul>
        <template v-for="item in legendTypes">
          <li
            :key="item.class"
            :class="activeLegend.indexOf(item.class) > -1 ? 'active' : ''"
            @click="setSelected(item)"
          >
            <i class="iconfont" :class="item.class"></i>
            <span class="legend-text">{{ item.name }}</span>
          </li>
        </template>
        <li
          :class="activeLegend.length == legendTypes.length ? 'active' : ''"
          @click="allLegendHandle"
        >
          <i class="iconfont iconai-eye"></i>
          <span class="legend-text">全部</span>
        </li>
      </ul>
    </div>
    <div class="info-box" ref="infoBox">
      <ul v-if="activeFeature">
        <template v-for="(item, index) in activeFeature.values_.pointVals">
          <li :key="index">
            {{ item.tm ? item.tm : form.time }}
            {{ item.valName }}: {{ item.val ? item.val : "--"
            }}{{ item.valUnit }}
          </li>
        </template>
      </ul>
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
import { Text, Style, Fill } from "ol/style";
import VectorSource from "ol/source/Vector";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { getCad, addCadPoint, getCadPoint } from "@/http/api";
import { loadImg } from "@/utils/dom";
import fecha from "fecha";
export default {
  name: "generalLayout",
  data() {
    return {
      olMap: {},
      loading: false,
      iconMap: [
        { class: "icondaochuixian2", unicode: "\ue656", name: "倒垂线" },
        { class: "iconzhengchuixian2", unicode: "\ue657", name: "正垂线" },
        { class: "iconwenduji", unicode: "\ue699", name: "温度计" },
        { class: "iconcefengji", unicode: "\ue653", name: "测缝计" },
        { class: "icondaochuixian", unicode: "\ue654", name: "倒垂线" },
        { class: "icongangjinji", unicode: "\ue655", name: "钢筋计" },
        { class: "iconzhengchuixian", unicode: "\ue658", name: "正垂线" },
        { class: "iconbiaomianwenduji", unicode: "\ue659", name: "表面温度计" },
        { class: "iconliangshuiyan", unicode: "\ue65c", name: "量水堰" },
        {
          class: "iconshuiguanshikongxiyaliyi",
          unicode: "\ue65d",
          name: "水管式孔隙压力仪",
        },
        { class: "iconcefengji2", unicode: "\ue65e", name: "测缝计" },
        {
          class: "icon--xinpingbidianlan",
          unicode: "\ue64c",
          name: "芯屏蔽电缆",
        },
        { class: "icon--liangshuiyanji", unicode: "\ue64e", name: "量水堰计" },
        { class: "icon--shenyaji", unicode: "\ue64f", name: "渗压计" },
        {
          class: "icon--shuxiangweiyidongbiaodian",
          unicode: "\ue650",
          name: "竖向位移动标点",
        },
        {
          class: "icon--shuipingweiyigongzuojidian",
          unicode: "\ue651",
          name: "水平位移工作基点",
        },
        {
          class: "icon--shuipingweiyixiaohejidian",
          unicode: "\ue652",
          name: "水平位移校核基点",
        },
        {
          class: "icon--ceyaguan",
          unicode: "\ue64d",
          name: "测压管",
        },
        {
          class: "icongangjinji2maoganyingliji",
          unicode: "\ue65b",
          name: "钢筋计",
        },
        {
          class: "icondazhongxingshuiku",
          unicode: "\ue797",
          name: "库水温",
        },
        {
          class: "iconshuiwen",
          unicode: "\ue6fb",
          name: "水温",
        },
      ],
      features: [],
      imgUrl: "",
      activeLegend: [],
      options: [{ label: "主坝", value: "主坝" }],
      dataList: [],
      form: {
        prnm: "主坝",
        time: "",
      },
      currentIndex: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      currentPoints: [],
      activeFeature: null,
      baseUrl: "http://220.180.11.124:8099",
    };
  },
  created() {
    this.form.time = fecha.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
    this.initImg();
  },
  beforeDestroy() {
    window.olMap = null;
  },
  computed: {
    styles() {
      let styles = {};
      let fill = new Fill({ color: "#00ff00" });
      this.iconMap.forEach((v) => {
        styles[v.class] = new Style({
          text: new Text({
            font: '18px "iconfont"',
            fill,
            text: v.unicode,
          }),
        });
      });
      styles["hidden"] = new Style(null);
      return styles;
    },
    legendTypes() {
      return this.iconMap.filter((v) => {
        return this.currentPoints.map((p) => p.icimg).includes(v.class);
      });
    },
  },
  methods: {
    async initImg() {
      // cadId: 1 是坝体的布置图，需要根据监测部位联动
      await getCad({ isDsm: "1" }).then((r) => {
        if (r.data.code == "200") {
          // this.imgUrl = r.data.data.url
          this.dataList = r.data.data;
          if (r.data.data.length > 0) {
            this.imgUrl = this.baseUrl + r.data.data[0].url;
            this.form.prnm = r.data.data[0].cadId;
          }
        }
      });
      loadImg(this.imgUrl).then((img) => {
        let extent = [0, 0, img.width, img.height];
        this.init(extent);
      });
    },
    init(extent) {
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
          zoom: 2.5,
          maxZoom: 8,
        }),
      });
      // 点击地图取坐标点
      // window.olMap.on("click", function (evt) {
      //   console.log(evt.coordinate);
      //   that.addPointToDb(evt.coordinate)
      // });

      window.olMap.on("pointermove", function (evt) {
        let feature = window.olMap.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );
        if (feature) {
          that.activeFeature = feature;
          that.$refs.infoBox.style.left = evt.pixel_[0] + 20 + "px";
          that.$refs.infoBox.style.top = evt.pixel_[1] + 50 + "px";
          that.$refs.infoBox.style.visibility = "visible";
        } else {
          that.activeFeature = null;
          that.$refs.infoBox.style.visibility = "hidden";
        }
      });

      this.getPoint();
    },
    // 从图上标记点的位置存入数据库
    addPointToDb(coordinate) {
      let params = {
        cadId: this.form.prnm,
        ptcd: "PL13-02",
        x: coordinate[0],
        y: coordinate[1],
      };
      addCadPoint(params).then((r) => {});
    },
    // 获取所有的标记点
    getPoint() {
      this.clear();
      this.loading = true;
      let params = {
        cadId: this.form.prnm,
        startTime: fecha.format(new Date(), "YYYY-MM-DD HH:mm:ss"), //没有用，后台不取这个值，不传会报500
        endTime: this.form.time,
      };
      getCadPoint(params).then((r) => {
        this.loading = false;
        if (r.data.code == 200) {
          let data = r.data.data;
          this.addPoint(data);
          this.currentPoints = data;
          this.activeLegend = Array.from(new Set(data.map((v) => v.icimg)));
        }
      });
    },
    addPoint(data) {
      data.forEach((v) => {
        let coordinate = [v.x, v.y];
        let feature = new Feature({
          type: v.icimg,
          ptcd: v.ptcd,
          pointVals: v.pointVals,
          geometry: new Point(coordinate),
        });
        feature.setStyle(this.styles[v.icimg]);
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
    changePart(val, i) {
      this.dataList.forEach((el, index) => {
        if (el.cadId === val) {
          this.currentIndex = index;
        }
      });
      this.imgUrl = this.baseUrl + this.dataList[this.currentIndex].url;
      document.getElementById("map").innerHTML = "";
      this.loading = true;
      loadImg(this.imgUrl).then((img) => {
        let extent = [0, 0, img.width, img.height];
        setTimeout(() => {
          this.init(extent);
        }, 500);
      });
    },
    changeTime(val) {
      if (val) {
        this.getPoint();
      }
    },
    clear() {
      let symbolLayer = window.olMap.getLayers().item(1);
      if (!symbolLayer.getSource()) return;
      let features = symbolLayer.getSource().getFeatures();
      features.forEach((v) => {
        symbolLayer.getSource().removeFeature(v);
      });
      this.features = [];
    },
    setSelected(item) {
      let flag = this.activeLegend.indexOf(item.class);
      if (flag > -1) {
        this.activeLegend.splice(flag, 1);
      } else {
        this.activeLegend.push(item.class);
      }
      let features = this.features.filter((feature) => {
        return feature.values_.type == item.class;
      });
      if (flag > -1) {
        features.forEach((feature) => {
          feature.setStyle(this.styles["hidden"]);
        });
      } else {
        features.forEach((feature) => {
          feature.setStyle(this.styles[item.class]);
        });
      }
    },
    allLegendHandle() {
      if (this.activeLegend.length == this.legendTypes.length) {
        // 如果当前为全选
        this.activeLegend = [];
        this.features.forEach((feature) => {
          feature.setStyle(this.styles["hidden"]);
        });
      } else {
        this.activeLegend = this.legendTypes.map((v) => {
          return v.class;
        });
        this.features.forEach((feature) => {
          let type = feature.values_.type;
          feature.setStyle(this.styles[type]);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.generalLayout {
  @include styles("background-color", "blockBg");
  padding: 10px;
  position: relative;
  .legend-box {
    position: absolute;
    bottom: 0;
    right: 10px;
    width: 230px;
    padding: 10px 20px;
    background: $white;
    border: 1px solid #eee;
    // box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    min-height: 160px;
    box-sizing: border-box;
    .legend {
      text-align: center;
    }
    li {
      display: inline-block;
      margin-top: 5px;
      width: 60px;
      text-align: center;
      line-height: 22px;
      font-size: 0.9rem;
      cursor: pointer;
      &.active {
        color: #00a1ff;
      }
      .legend-text {
        display: block;
        color: #030303;
      }
    }
  }
  .info-box {
    position: absolute;
    background: $white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    @include transition;
    visibility: hidden;
    > ul {
      font-size: 0.95rem;
      line-height: 1.5rem;
      color: $blue-1;
      > li {
        padding: 0 10px;
      }
    }
  }
}
</style>
