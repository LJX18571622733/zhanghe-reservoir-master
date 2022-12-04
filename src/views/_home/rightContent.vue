<template>
  <!-- 首页-右侧模块 -->
  <div class="rightContent">
    <div class="waterRain pr" v-loading="wrLoading">
      <BigDataBox1></BigDataBox1>
      <BigDataTitle1 class="title">水雨情</BigDataTitle1>
      <div class="waterRain-content">
        <wr-com
          :item="item"
          v-for="(item, index) in rainData"
          :key="index"
          class="waterRainitem"
          @clickHandle="waterRainClick"
        ></wr-com>
      </div>
    </div>
    <div class="monitor pr mt-15" v-loading="lineLoading">
      <BigDataBox1></BigDataBox1>
      <BigDataTitle1 class="title">工情信息</BigDataTitle1>
      <mon-com
        :item="item"
        v-for="(item, index) in monData"
        :key="index"
        class="monitoritem"
      >
        <time-line
          ref="timeline"
          :item="item"
          @dbClick="pointLineHandle"
        ></time-line>
      </mon-com>
    </div>
    <!-- <div class="video pr mt-15">
      <BigDataBox1></BigDataBox1>
      <BigDataTitle1 class="title">视频监控</BigDataTitle1>
      <div class="flex-layout">
        <div class="flex-1" style="padding: 0 20px">
          <mon-video src="../assets/video/skzb.mp4"></mon-video>
        </div>
        <div class="flex-1" style="padding: 0 20px">
          <mon-video src="../assets/video/skzb.mp4"></mon-video>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import BigDataTitle1 from "@/components/BigData/Title/default.vue";
import WrCom from "@/components/BigData/BigCom/WrCom.vue";
import MonCom from "@/components/BigData/BigCom/MonCom.vue";
import MonVideo from "@/components/MonVideo.vue";
import TimeLine from "@/components/BigData/charts/default/timeLine.vue";
import { getRightInfo, getRightWRInfo } from "@/http/api";
export default {
  name: "rightContent",
  components: {
    BigDataBox1,
    BigDataTitle1,
    WrCom,
    MonCom,
    MonVideo,
    TimeLine,
  },
  data() {
    return {
      rainData: null,
      monData: null,
      wrLoading: false,
      lineLoading: false,
    };
  },
  mounted() {
    this.getwrcom();
    this.getmoncom(); //获取右侧工情信息
  },
  methods: {
    // 右侧-水雨情 区域点击
    waterRainClick(item) {
      // console.log(item , '水雨情点击')
      if (item.mainTitle === "库水位") {
        this.$parent.dialogWidget.component = "real-rain-info";
        this.$parent.dialogWidget.visible = true;
        this.$parent.dialogWidget.title = "坝上水位变化过程线";
      } else if (item.mainTitle === "实时库容") {
        this.$parent.dialogWidget.component = "line-volumeskz";
        this.$parent.dialogWidget.visible = true;
        this.$parent.dialogWidget.title = "库容曲线";
      } else if (item.mainTitle === "今日降雨") {
        this.$parent.dialogWidget.component = "rain-water-info";
        this.$parent.dialogWidget.visible = true;
        this.$parent.dialogWidget.title = "实时降雨";
      }
    },
    getwrcom() {
      this.wrLoading = true;
      let obj = [
        {
          mainVal: 123.51,
          subList: [
            {
              subTitle: "校核洪水位-观音寺",
              subUnit: "m",
              subVal: 127.78,
            },
            {
              subTitle: "设计洪水位-观音寺",
              subUnit: "m",
              subVal: 125.08,
            },
            {
              subTitle: "校核洪水位-鸡公尖",
              subUnit: "m",
              subVal: 125.96,
            },
            {
              subTitle: "设计洪水位-鸡公尖",
              subUnit: "m",
              subVal: 124.99,
            }
          ],
          maiUnit: "m",
          mainTitle: "库水位",
          state: -1,
        },
        {
          mainVal: "10.41",
          subList: [
            {
              subTitle: "总库容",
              subUnit: "亿m³",
              subVal: "21.13",
            },
            {
              subTitle: "正常蓄水位以下库容",
              subUnit: "亿m³",
              subVal: "17.85",
            },
            {
              subTitle: "兴利库容",
              subUnit: "亿m³",
              subVal: "9.24",
            },
            {
              subTitle: "发电死库容",
              subUnit: "亿m³",
              subVal: "4.02",
            },
            {
              subTitle: "灌溉死库容",
              subUnit: "亿m³",
              subVal: "8.62",
            },
          ],
          maiUnit: "亿m³",
          mainTitle: "实时库容",
        },
        {
          mainVal: "0.0",
          subList: [
            {
              subTitle: "薛家坪",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "板桥",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "高峰",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "甘溪",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "肖埝",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "巡检",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "打鼓台",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "太平",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "东巩",
              subUnit: "mm",
              subVal: "0.0",
            },
            {
              subTitle: "泥龙",
              subUnit: "mm",
              subVal: 0,
            },
            {
              subTitle: "苍坪",
              subUnit: "mm",
              subVal: "0.0",
            },
          ],
          maiUnit: "mm",
          mainTitle: "今日降雨",
          state: null,
        },
      ];
      // getRightWRInfo().then((r) => {
        this.wrLoading = false;
        obj[0].iconColor = "#edaa44";
        obj[0].iconName = "iconkushuiwei-";

        obj[1].iconColor = "#fff563";
        obj[1].iconName = "icondangqiankurong-";

        obj[2].iconColor = "#1ce3ce";
        obj[2].iconName = "iconjinriyuliang-";
        this.rainData = obj;
        console.log(this.rainData);
      // });
    },
    getmoncom() {
      let that = this;
      this.lineLoading = true;
      const backColor = [
        "rgba(216, 168, 37, 0.5)",
        "rgba(231,119,80, 0.5)",
        "rgba(29, 206, 230, 0.5)",
        "rgb(28, 227, 206, 0.5)",
      ];
      const chartColor = [
        "rgba(255, 255, 0, 1)",
        "rgba(255,136,115, 1)",
        "rgba(0, 255, 255, 1)",
        "rgb(28, 227, 206, 1)",
      ];
      // {stime: '2013-11-5', etime: '2019-12-3'}
      getRightInfo({}).then((r) => {
        this.lineLoading = false;
        let data = [];
        r.data.data.forEach((item, index) => {
          if (item.length > 1) {
            data[index] = item.filter((val) => {
              return val.valName == "Y方向水平位移" || val.valName == "库水位";
            })[0];
          } else {
            data[index] = item[0];
          }
          if (data[index]) {
            data[index].backColor = backColor[index];
            data[index].chartColor = chartColor[index];
          }
        });
        this.monData = data;

        // 图表做联动
        let charts = [];
        setTimeout(() => {
          r.data.data.forEach((v, i) => {
            if (that.$refs.timeline[i]) {
              let chart = that.$refs.timeline[i].$refs.chart1;
              charts.push(that.$echarts.init(chart));
            }
          });
          this.$echarts.connect(charts);
        }, 500);
      });
    },
    pointLineHandle() {
      this.$emit("pointLineHandle", this.monData);
    },
  },
};
</script>

<style lang="scss" scoped>
.rightContent {
  .waterRain {
    min-height: 140px;
    padding-bottom: 10px;
    .waterRain-content {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      align-content: space-around;
      margin-top: 12px;
    }
  }
  .monitor {
    min-height: 450px;
    padding-bottom: 10px;
  }

  .video {
    min-height: 200px;
    text-align: center;
  }
  .bigDataBox-1 {
    height: 100%;
    top: -2px;
    left: -2px;
    right: -2px;
    z-index: -1;
  }
}
</style>