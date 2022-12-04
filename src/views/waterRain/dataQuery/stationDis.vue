<template>
  <!-- 水雨情-测站分布图 -->
  <div class="stationDis flex-layout">
    <!-- <el-form :model="form" class="form-style1" size="small">
            <el-form-item label="起止时间：">
                <el-date-picker
                    v-model="form.time"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :clearable="false"
                    @change="changeTime"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
        </el-form> -->
    <div class="flex-3 map-wrapper" v-loading="loading">
      <div id="map"></div>
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
    </div>
    <!-- 测站信息说明区 -->
    <div class="flex-2 pl-10 block-box info">
      <h3 class="content-title">站点信息说明</h3>
      <!-- <p class="paragraph">
        梅山水库地理位置为东经115°20'~115°56'，北纬31°06'~32°04'。水库坝址以上南北长约70km，东西宽约40km，水库流域面积1970²km，占史河6880²km总面积的28.6%。
      </p> -->
      <p class="paragraph">
        漳河水库水情自动测报系统由5个遥测站和1个中心站组成。遥测站具有自动采集水雨情信息的功能，并通过GPRS/GSM通信信道组成数据传输网，将水情数据传送到中心站，中心站对接收到的数据进行处理后存入实时数据库。
      </p>
      <el-table
        border
        :data="tableData"
        stripe
        size="small"
        class="mt-10"
        style="width: 100%"
        :key="tableKey"
      >
        <el-table-column type="index" label="序号" align="center" width="50">
        </el-table-column>
        <el-table-column prop="name" label="站名" align="center" width="85">
        </el-table-column>
        <el-table-column prop="type" label="站别" align="center" width="85">
        </el-table-column>
        <el-table-column prop="project" label="遥测项目" align="center">
        </el-table-column>
        <el-table-column prop="way" label="通信方式" width="120" align="center">
        </el-table-column>
        <el-table-column prop="work" label="工作体制" align="center">
        </el-table-column>
        <el-table-column prop="weight" label="权重" align="center">
        </el-table-column>
        <el-table-column prop="value" label="最新测值" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.name !== '黄泥庄'">{{ scope.row.value }}</div>
            <div
              v-if="
                scope.row.name === '黄泥庄' && scope.row.value !== undefined
              "
            >
              <div>{{ scope.row.value[0] }}、</div>
              <div>{{ scope.row.value[1] }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 测站信息框 -->
    <div class="info-box" ref="infoBox">
      <div class="info-list" v-if="activeFeature">
        <div class="list-title">站点资料</div>
        <div>
          <span class="list-label">站点: </span>{{ activeFeature.values_.ptnm }}
        </div>
        <div>
          <span class="list-label">站号: </span>{{ activeFeature.values_.ptcd }}
        </div>
        <div><span class="list-label">乡镇名: </span>金寨县梅山镇</div>
        <template v-for="item in activeFeature.values_.pointVals">
          <div v-if="item.valName == '降雨量'" :key="item.valName">
            <span class="list-label">小时雨量: </span>
            {{ item.val ? item.val : "0" }}{{ item.valUnit }} ({{ time }})
          </div>
          <div v-if="item.valName == '水位'" :key="item.valName">
            <span class="list-label">水位: </span>
            {{ item.val ? item.val : "0" }}{{ item.valUnit }} ({{ item.tm }})
          </div>
          <div
            v-if="activeFeature.values_.ptnm == '水库站'"
            :key="item.valName"
          >
            <span class="list-label">{{ item.valName }}: </span>
            {{ item.val ? item.val : "0" }}{{ item.valUnit }} ({{ item.tm }})
          </div>
        </template>
        <div>
          <span class="list-label">通信状态: </span
          >{{ activeFeature.values_.status == "0" ? "异常" : "正常" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fecha from "fecha";
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
// import { datetimerangeShortcuts } from '@/config/config'
import { loadImg } from "@/utils/dom";
// const timeOpt = [
//     {label: '今日', value: 'today'},
//     {label: '昨日', value: 'yesterday'},
//     {label: '近三天', value: 'recent_three_days'},
//     {label: '本周', value: 'week'},
//     {label: '近十天', value: 'recent_ten_days'},
//     {label: '本月', value: 'month'},
//     {label: '本年', value: 'year'},
// ]
let autoPlayInterval = null;
export default {
  name: "stationDis",
  data() {
    return {
      tableKey: 0,
      loading: false,
      // form: {
      //     time: []
      // },
      // pickerOptions: {
      //     shortcuts: datetimerangeShortcuts(timeOpt),
      //     disabledDate(time) {
      //         return time.getTime() > Date.now()
      //     }
      // },
      imgUrl: "",
      iconMap: [
        { class: "icondian", unicode: "\ue62c", name: "雨量站" },
        { class: "iconshuiwenzhan", unicode: "\ue608", name: "河道站" },
        { class: "icondazhongxingshuiku", unicode: "\ue797", name: "水库站" },
      ],
      features: [],
      activeLegend: [],
      currentPoints: [],
      activeFeature: null,
      tableData: [
        {
          name: "漳河水管所",
          type: "中心站",
          project: "",
          way: "GPRS/GSM",
          work: "自报式",
          weight: "",
        },
        {
          name: "XX",
          type: "遥测站",
          project: "雨量",
          way: "GPRS/GSM",
          work: "自报式",
          weight: "0.083",
        },
      ],
      time: "",
      styles: {
        hidden: new Style({
          zIndex: -1,
        }),
      },
    };
  },
  computed: {
    legendTypes() {
      return this.iconMap.filter((v) => {
        return this.currentPoints.map((p) => p.icimg).includes(v.class);
      });
    },
  },
  mounted() {
    this.initImg();
  },
  beforeDestroy() {
    window.olMap = null;
    window.clearInterval(autoPlayInterval);
  },
  methods: {
    // initTime() {
    //     // 默认为值为今日8时至当前时间，如果当前时间为8时之前，默认值为昨日八时至当前时间
    //     let current = new Date()
    //     let eightClock = new Date()
    //     eightClock.setHours(8,0,0) //取当天八点
    //     if (eightClock.getTime() > current.getTime()) {
    //         let start = new Date()
    //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
    //         start.setHours(8,0,0) //取昨天八点
    //         this.form.time = [fecha.format(start, 'YYYY-MM-DD HH:mm:ss'), fecha.format(current, 'YYYY-MM-DD HH:mm:ss')]
    //     } else {
    //         this.form.time = [fecha.format(eightClock, 'YYYY-MM-DD HH:mm:ss'), fecha.format(current, 'YYYY-MM-DD HH:mm:ss')]
    //     }
    // },
    // changeTime(val) {
    //     if (val) {
    //         this.clear()
    //         this.getPoint()
    //     }
    // },
    async initImg() {
      // cadId: 2 是水雨情测站分布图
      await getCad({ cadId: "2" }).then((r) => {
        if (r.data.code == "200") {
          this.imgUrl = r.data.data.url;
        }
      });
      loadImg(this.imgUrl).then((img) => {
        let extent = [0, 0, img.width, img.height];
        this.init(extent);
      });
      // this.init([0, 0, 500, 500]);
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
          zoom: 1.9,
          maxZoom: 8,
        }),
      });
      // 点击地图取坐标点
      // window.olMap.on('click', function (evt) {
      //     console.log(evt)
      //     let feature = new Feature({
      //         type: 'icondazhongxingshuiku',
      //         geometry: new Point(evt.coordinate)
      //     })
      //     feature.setStyle(that.styles['icondazhongxingshuiku'])
      //     that.features.push(feature)
      //     let symbolLayer = window.olMap.getLayers().item(1)
      //     if (!symbolLayer.getSource()) {
      //         symbolLayer.setSource(new VectorSource({
      //             features: that.features,
      //         }))
      //     } else {
      //         symbolLayer.getSource().addFeature(feature)
      //     }
      //     that.addPointToDb(evt.coordinate)
      // })

      window.olMap.on("click", function (evt) {
        let feature = window.olMap.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );
        if (feature) {
          that.setInfoBox(feature, evt.pixel_, "click");
        } else {
          that.hideInfoBox();
        }
      });

      this.getPoint();
    },
    // 从图上标记点的位置存入数据库
    addPointToDb(coordinate) {
      let params = {
        cadId: 2,
        ptcd: "50500301",
        x: coordinate[0],
        y: coordinate[1],
      };
      addCadPoint(params).then((r) => {});
    },
    // 获取所有的标记点
    getPoint() {
      this.loading = true;
      let time = new Date();
      time.setHours(time.getHours(), 0, 0);
      this.time = fecha.format(time, "YYYY-MM-DD HH:mm:ss"); //当前小时
      let params = {
        cadId: "2",
        startTime: this.time,
        endTime: this.time, //当前小时
      };
      getCadPoint(params).then((r) => {
        this.loading = false;
        if (r.data.code == 200) {
          let data = r.data.data;

          this.addPoint(data);
          this.currentPoints = data;
          this.activeLegend = Array.from(new Set(data.map((v) => v.icimg)));
          this.tableData.forEach((el) => {
            data.forEach((e) => {
              if (el.name.indexOf("黄泥庄") == 0) {
                if (el.value === undefined) {
                  el.value = [];
                }
                if (e.ptnm.indexOf("黄泥庄雨量") == 0) {
                  el.value[0] =
                    e.pointVals[0].val === null
                      ? 0 + e.pointVals[0].valUnit
                      : e.pointVals[0].val + e.pointVals[0].valUnit;
                } else if (e.ptnm.indexOf("黄泥庄河道") == 0) {
                  el.value[1] =
                    e.pointVals[0].val === null
                      ? 0 + e.pointVals[0].valUnit
                      : e.pointVals[0].val + e.pointVals[0].valUnit;
                }
              } else if (el.name.indexOf("坝下") == 2) {
                if (e.ptnm.indexOf("坝下") == 0) {
                  el.value =
                    e.pointVals[0].val === null
                      ? 0 + e.pointVals[0].valUnit
                      : e.pointVals[0].val + e.pointVals[0].valUnit;
                }
              } else {
                if (e.ptnm.indexOf(el.name) == 0) {
                  el.value =
                    e.pointVals[0].val === null
                      ? 0 + e.pointVals[0].valUnit
                      : e.pointVals[0].val + e.pointVals[0].valUnit;
                }
              }
            });
          });
          this.tableKey++;
          // 自动播放
          this.autoPlay();
        }
      });
    },
    addPoint(data) {
      data.forEach((v) => {
        let coordinate = [v.x, v.y];
        let status = v.pointVals[0].status;
        let feature = new Feature({
          type: v.icimg,
          pointVals: v.pointVals,
          ptnm: v.ptnm,
          ptcd: v.ptcd,
          status,
          geometry: new Point(coordinate),
        });
        if (!this.styles[v.icimg]) {
          this.setIconStyle(v.icimg, status);
        }
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
    clear() {
      let symbolLayer = window.olMap.getLayers().item(1);
      if (!symbolLayer.getSource()) return;
      let features = symbolLayer.getSource().getFeatures();
      features.forEach((v) => {
        symbolLayer.getSource().removeFeature(v);
      });
      this.features = [];
    },
    setIconStyle(type, status) {
      let fill = new Fill({ color: status == "0" ? "#ff8000" : "#00ff00" });
      this.styles[type] = new Style({
        text: new Text({
          font: '16px "iconfont"',
          fill,
          text: this.iconMap.filter((v) => {
            return v.class == type;
          })[0].unicode,
        }),
        zIndex: 0, //根据zIndex标识是否显示标记
      });
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
      // 重新加载定时器
      this.autoPlay();
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
      // 重新加载定时器
      this.autoPlay();
    },
    // 循环播放当前显示的所有测站的信息
    autoPlay() {
      window.clearInterval(autoPlayInterval);
      this.hideInfoBox();

      let that = this;
      let symbolLayer = window.olMap.getLayers().item(1);
      if (!symbolLayer.getSource()) return;
      let features = symbolLayer.getSource().getFeatures();
      features = features.filter((feature) => {
        return feature.getStyle().zIndex_ > -1;
      });
      if (!features.length) return;

      this.setInfoBox(features[0], this.getPixelFromFeature(features[0]));

      let index = 1;
      autoPlayInterval = window.setInterval(function () {
        if (index >= features.length) index = 0;
        let pixels = that.getPixelFromFeature(features[index]);
        that.setInfoBox(features[index], pixels);
        index++;
      }, 5000);
    },
    // 根据feature获取坐标
    getPixelFromFeature(feature) {
      let coordinate = feature.getGeometry().getCoordinates();
      let pixels = window.olMap.getPixelFromCoordinate(coordinate);
      return pixels;
    },
    // 设置站点信息框位置
    setInfoBox(feature, pixels, event) {
      this.activeFeature = feature;
      this.$refs.infoBox.style.left = pixels[0] + 35 + "px";
      this.$refs.infoBox.style.top = pixels[1] - 35 + "px";
      this.$refs.infoBox.style.visibility = "visible";
      if (event == "click") {
        window.clearInterval(autoPlayInterval);
      }
    },
    // 隐藏站点信息框
    hideInfoBox() {
      this.activeFeature = null;
      this.$refs.infoBox.style.visibility = "hidden";
    },
  },
};
</script>

<style lang="scss" scoped>
.stationDis {
  @include styles("background-color", "blockBg");
  padding: 10px;
  position: relative;
  .map-wrapper {
    position: relative;
    @include themeify {
      border-right: 1px solid themed(splitLine);
    }
  }
  #map {
    height: 100%;
  }
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
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    @include transition;
    visibility: hidden;
    &::after {
      content: "";
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-right: 10px solid $white;
      border-bottom: 8px solid transparent;
      position: absolute;
      left: -9px;
      top: 40px;
    }
    .info-list {
      min-width: 220px;
      line-height: 1.6rem;
      > div {
        padding-left: 15px;
        padding-right: 10px;
      }
      .list-title {
        background: #3392ff;
        color: #fff;
        line-height: 2.2rem;
        border-radius: 4px 4px 0 0;
      }
      .list-label {
        color: #5a5a5a;
      }
    }
  }
  .content-title {
    font-size: 1.2rem;
    line-height: 3rem;
    text-align: center;
    @include styles("color", "titleTextColor");
  }
  .paragraph {
    @include styles("color", "mainTextColor");
    text-indent: 2rem;
    line-height: 1.8rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    /deep/ .el-table {
      flex: unset;
      height: 613px;
    }
  }
}
</style>