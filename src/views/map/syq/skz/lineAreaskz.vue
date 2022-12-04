<template>
  <!-- 水位面积曲线 -->
  <div
    class="info flex-layout"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div class="chart1 flex-1" ref="chart2"></div>
    <div class="tableForm flex-col-layout">
      <div class="form-wrapper">
        <BigDataBox3>
          <el-form :inline="true" :model="formLine" class="demo-form-inline">
            <el-form-item label="库水位:">
              <el-input v-model="formLine.line"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSubmit"
                >计算</el-button
              >
            </el-form-item>
          </el-form>
        </BigDataBox3>
      </div>
      <div class="form-wrapper mt-10">
        <BigDataBox3>
          <el-form :inline="true" :model="formLine" class="demo-form-inline">
            <el-form-item label="面积:">
              <el-input v-model="formLine.area"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="exportData"
                >导出</el-button
              >
            </el-form-item>
          </el-form>
        </BigDataBox3>
      </div>
      <div class="table-wrapper flex-1">
        <BigDataBox3 style="width: 100%; height: 100%">
          <el-table
            border
            :data="chartData"
            height="100%"
            :stripe="true"
            ref="singleTableA"
            highlight-current-row
            id="out-table-skz-area"
            class="tableFormSon"
            style="width: 100%"
          >
            <el-table-column prop="y" label="库水位(m)"> </el-table-column>
            <el-table-column prop="x" label="面积(平方公里)"> </el-table-column>
          </el-table>
        </BigDataBox3>
      </div>
    </div>
  </div>
</template>

<script>
import { chartColors } from "@/components/BigData/charts/default/colors";
import { exportToExcel } from "@/common/common";
import { getRiverZvarla, getAtoZ, getZtoA } from "@/http/api";
import BigDataBox3 from "@/components/BigData/Box/box3.vue";

export default {
  name: "lineArea", //水位面积
  props: ["dataList", "color", "com", "index", "pointid"],
  data() {
    return {
      formLine: { line: "", area: "" },
      ptid: "",
      chartData: [],
      line: null,
      loading: false,
      river: this.$store.state.river,
    };
  },
  components: {
    BigDataBox3,
  },
  mounted() {
    if (this.com == this.index) {
      this.init();
    }
  },
  methods: {
    async init() {
      if (!this.river["rr"].length) {
        await this.getRR();
      }
      if (!this.river["waterLine"]) {
        await this.getWaterLine();
      }
      this.getData();
    },
    getData() {
      this.loading = false;
      let that = this;
      this.line = this.river["waterLine"];
      this.river["rr"].forEach((item) => {
        if (that.pointid == item.ptid) {
          that.ptid = item.ptcd;
        }
      });

      getRiverZvarla(window.cfg["坝上"]).then(function (r) {
        that.loading = true;
        if (r.data.data.length > 0) {
          that.chartData = r.data.data;
          that.initCharts();
          that.formLine.line = that.line;
          that.dingwei();
        }
      });
    },
    initCharts() {
      var that = this;
      let chart = this.$refs.chart2;
      let chart1 = this.$echarts.init(chart);
      let index = this.chartData.findIndex((item) => {
        return Math.round(this.line) == Math.round(item.y);
      });
      if (index > -1) {
        index = this.chartData[index].x;
      }

      let option = {
        animationThreshold: 10000, //超过就没有动画效果
        legend: {
          data: ["库水位-面积"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            return (
              "水位: " +
              params[0].data[1] +
              "m <br/> 面积：" +
              params[0].data[0] +
              "平方公里"
            );
          },
        },
        toolbox: {
          show: true,
          iconStyle: {
            borderColor: chartColors[that.sysTheme].toolbox,
          },
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            saveAsImage: {
              show: true,
              type: "png",
              title: "保存为图片",
            },
          },
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          name: "面积(平方公里)",
          type: "value",
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: chartColors[that.sysTheme].splitLine,
            },
          },
          axisLine: {
            lineStyle: {
              color: chartColors[that.sysTheme].axisLine,
            },
          },
        },
        yAxis: {
          name: "水位(m)",
          type: "value",
          axisLine: {
            lineStyle: {
              color: chartColors[that.sysTheme].axisLine,
              onZero: false,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: chartColors[that.sysTheme].splitLine,
            },
          },
          axisLabel: {
            formatter: "{value}",
          },
          boundaryGap: false,
          min: parseInt(that.chartData[0].y),
          // min: Math.floor(Math.min.apply(null, that.chartData.map(item => {return item.y}).map(Number)))
        },
        series: [
          {
            name: "库水位-库水位面积曲线",
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              width: 3,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowBlur: 10,
              shadowOffsetY: 10,
            },
            markPoint: {
              itemStyle: {
                color: chartColors[that.sysTheme].markPoint,
              },
              label: {
                color: this.sysTheme == "light" ? "#000" : "#fff",
              },
              data: [
                {
                  name: "周最低",
                  value: this.line + "m",
                  xAxis: index,
                  yAxis: this.line,
                },
              ],
            },
            itemStyle: {
              color: chartColors[that.sysTheme].series,
            },
            data: this.chartData.map((item) => {
              return [item.x, item.y];
            }),
          },
        ],
      };

      chart1.setOption(option);
      // chart1.resize();
      // window.addEventListener("resize", function () {
      //     chart1.resize();
      // });
    },
    onSubmit() {
      let that = this;
      if (this.formLine.line) {
        getZtoA(this.ptid, this.formLine.line).then(function (r) {
          that.formLine.area = r.data.data;
          that.dingwei();
        });
      } else if (this.formLine.area) {
        getAtoZ(this.ptid, this.formLine.area).then(function (r) {
          that.formLine.line = r.data.data;
          that.dingwei();
        });
      }
    },
    dingwei() {
      let that = this;
      this.chartData.forEach((item, index) => {
        if (that.formLine.line == item.y) {
          that.$refs.singleTableA.setCurrentRow(that.chartData[index]);

          setTimeout(function () {
            let a = document.querySelector("#out-table-skz-area");
            let b = a.querySelector(".current-row");
            b.scrollIntoView({ block: "center" });
          }, 500);
        }
      });
    },
    exportData() {
      exportToExcel("水位库容数据", "out-table-skz-area");
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/map/lineskz";
.info {
  .tableFormSon {
    /deep/.el-table__body-wrapper {
      height: calc(100% - 44px) !important;
    }
  }
}
</style>
