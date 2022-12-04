<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div class="chart1" ref="chart2"></div>
    <div class="tableForm">
      <el-form :inline="true" :model="formLine" class="demo-form-inline">
        <el-form-item label="水位:">
          <el-input v-model="formLine.line"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit"
            >计算</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formLine" class="demo-form-inline">
        <el-form-item label="流量:">
          <el-input v-model="formLine.area"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="exportData"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        border
        :data="tableData"
        height="525"
        :stripe="true"
        ref="singleTable"
        highlight-current-row
        id="out-table-swllgx"
        class="tableFormSon"
      >
        <el-table-column prop="y" label="库水位(m)"> </el-table-column>
        <el-table-column prop="x" label="流量(m³/s)"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { colorArr } from "@/components/BigData/charts/default/colors";
import { getRiverZqrl, getZtoQ, getQtoZ, realWaterInfo } from "@/http/api";
import { exportToExcel } from "@/common/common";

export default {
  name: "lineArea", //水位面积
  props: ["dataList", "color", "com", "index", "pointid"],
  data() {
    return {
      formLine: { line: "", area: "" },
      ptid: "",
      tableData: [],
      waterLine: "",
      loading: false,
    };
  },
  mounted() {
    if (this.com == this.index) {
      this.getPtid();
    }
  },
  methods: {
    getPtid() {
      let that = this;
      let river = this.$store.state.river["zz"];
      for (let i = 0, len = river.length; i < len; i++) {
        if (river[i].ptid == that.pointid) {
          that.ptid = river[i].ptcd;
          that.getData();
        }
      }
    },
    getData() {
      this.loading = false;
      let that = this;
      //实时水情
      realWaterInfo(window.cfg["坝上"]).then(function (r) {
        that.waterLine = r.data.data.blrz;

        getRiverZqrl(that.ptid).then(function (r) {
          if (r.data.data) {
            that.tableData = r.data.data;
            that.initCharts();
          }
          that.loading = true;
        });
      });
    },
    initCharts() {
      var that = this;
      let chart = this.$refs.chart2;
      let chart1 = this.$echarts.init(chart);

      let index = this.tableData.findIndex((item) => {
        return that.waterLine == item.y;
      });
      if (index > -1) {
        index = this.tableData[index].x;
      }

      let option = {
        animationThreshold: 10000, //超过就没有动画效果
        legend: {
          data: ["水位-流量"],
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
              "m <br/> 流量：" +
              params[0].data[0] +
              "m³/s"
            );
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          show: true,
          iconStyle: {
            borderColor: "#fff",
          },
          right: 10,
          feature: {
            saveAsImage: {
              show: true,
              type: "png",
              title: "保存为图片",
            },
          },
        },
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "#18aecd",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#18aecd",
              onZero: false,
            },
          },
          splitLine: { show: false },
          axisLabel: {
            formatter: "{value}",
          },
          boundaryGap: false,
          min: Math.floor(
            Math.min.apply(
              null,
              that.tableData
                .map((item) => {
                  return item.y;
                })
                .map(Number)
            )
          ),
        },
        series: [
          {
            name: "库水位-流量曲线",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowBlur: 10,
              shadowOffsetY: 10,
            },
            itemStyle: {
              color: colorArr[10],
            },
            markPoint: {
              itemStyle: {
                color: colorArr[0],
              },
              label: {
                color: '#fff',
              },
              data: [
                // {
                //   name: "周最低",
                //   value: this.waterLine + "m",
                //   xAxis: index,
                //   yAxis: this.waterLine,
                // },
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            // markPoint: {
            //   symbol: "circle",
            //   symbolSize: 10,
            //   symbolOffset: [0, -20],
            //   itemStyle: {
            //     color: "red",
            //   },
            //   data: [
            //     { type: "max", name: "Max" },
            //     { type: "min", name: "Min" },
            //   ],
            // },
            data: that.tableData.map((item) => {
              return [item.x, item.y];
            }),
          },
        ],
      };

      chart1.setOption(option);
      // chart1.resize();
      window.addEventListener("resize", function () {
        chart1.resize();
      });
    },
    onSubmit() {
      let that = this;
      if (this.formLine.line) {
        getZtoQ(that.ptid, that.formLine.line).then(function (r) {
          that.formLine.area = r.data.data;
          that.dingwei();
        });
      } else if (this.formLine.area) {
        getQtoZ(that.ptid, that.formLine.area).then(function (r) {
          that.formLine.line = r.data.data;
          that.dingwei();
        });
      }
    },
    dingwei() {
      let that = this;
      this.tableData.forEach((item, index) => {
        if (that.formLine.line == item.y) {
          that.$refs.singleTable.setCurrentRow(that.tableData[index]);

          setTimeout(function () {
            let a = document.querySelector("#out-table-swllgx");
            let b = a.querySelector(".current-row");
            b.scrollIntoView({ block: "center" });
          }, 500);
        }
      });
    },
    exportData() {
      exportToExcel("水位流量关系", "out-table-swllgx");
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.getPtid();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.info {
  height: 670px;
  width: 100%;
  /*background: rgba(40, 73, 133, 0.8);*/

  .tableForm {
    height: 100%;
    width: 29%;
    float: right;

    /deep/ .el-input__inner {
      background-color: transparent;
      border: 1px solid #00f8fe;
      color: #fff;
    }

    /deep/ .el-form-item__label {
      width: 60px;
      padding: 0 5px 0 0;
    }

    .demo-form-inline {
      background: url("../../../../assets/images/icon001.jpg") no-repeat;
      background-size: 330px 50px;
      margin: 10px 5px 5px 5px;
      line-height: 50px;

      /deep/ .el-form-item {
        margin-bottom: 0px;

        .el-form-item__content {
          line-height: 50px;
        }

        .el-form-item__label {
          color: #00f8fe;
        }
      }
    }

    .tableFormSon {
      background-image: url("../../../../assets/images/bg_tk1.png");
      background-color: rgba(40, 73, 133, 0.8);
      margin: 10px 5px 5px 5px;
      width: 330px;
      background-size: 330px 525px;

      /deep/ .el-table td,
      .el-table th.is-leaf {
        border-bottom: none;
      }
      /deep/.el-table__body-wrapper {
        height: calc(100% - 44px) !important;
      }
    }
  }

  /deep/ .el-form-item__label {
    color: #fff;
  }

  /deep/ .el-table {
    background-color: transparent;
  }

  /deep/ .el-table th,
  /deep/ .el-table tr {
    color: #fff;
    background: transparent;
  }

  /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: transparent;
  }

  /deep/ .el-table__row--striped {
    background: rgba(40, 73, 133, 0.8) !important;
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(40, 73, 133, 0.8);
  }
}

.chart1 {
  height: 660px;
  width: 70%;
  float: left;
}
</style>
