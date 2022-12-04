<template>
  <!-- 水雨情 - 水位变化过程 -->
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div class="one">
      <div ref="chart1" class="chart1"></div>
    </div>
    <div class="two">
      <!--<div ref="chart2" class="chart2"></div>-->
      <div class="view">
        <div class="prBox">
          <p>高水位报警 {{ data.taz | numtoFixed(2) }} m</p>
          <div class="lines line_blue"></div>
          <p>历史高水位 {{ data.obhtz | numtoFixed(2) }} m</p>
          <div class="lines line_blue"></div>
          <p>警戒水位 {{ data.wrz | numtoFixed(2) }} m</p>
          <div class="lines line_blue"></div>
          <p>保证水位 {{ data.grz | numtoFixed(2) }} m</p>
          <div class="lines line_blue"></div>
          <p class="color_yellow">实时水位 {{ form.z | numtoFixed(2) }} m</p>
          <div class="lines bg_yellow"></div>
          <p class="color_orange">
            低水位告警 {{ data.laz | numtoFixed(2) }} m
          </p>
          <div class="lines bg_Orange"></div>
          <p>历史低水位 {{ data.hlz | numtoFixed(2) }} m</p>
          <div class="lines line_blue"></div>
          <img class="sw-bg" src="../../../../assets/images/sw-bg.png" alt="" />
        </div>
      </div>
    </div>
    <div class="three">
      <div style="width: 50%; float: left">
        <el-table
          border
          :data="tableData"
          height="345"
          style="width: 100%; background: rgba(40, 73, 133, 0.8)"
        >
          <el-table-column
            prop="name"
            label=""
            align="center"
          ></el-table-column>
          <el-table-column prop="water" label="水位" width="80" align="center">
          </el-table-column>
          <el-table-column prop="num" label="流量" width="80" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 50%; float: right">
        <el-row>
          <el-col :span="24">
            <span class="textL">实时水位</span>
            <div class="img-text-big">
              <span class="textN">{{ form.z }}m</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <span class="textL">实时流量</span>
            <div class="img-text-big">
              <span class="textN">{{ form.q }}m³/s</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moreLine from "@/components/BigData/charts/other/moreLine";
import { colorArr } from "@/components/BigData/charts/default/colors";
import {
  getWaterLine,
  getrsvrfcch,
  realWaterInfo,
  getPointVal,
  getHdWaterLine,
  getHdWaterQ,
} from "@/http/api";
import { dataTimeFormatFirst, timeFormatToWay } from "@/common/common";

export default {
  props: ["dataurl", "pointid", "com", "index"],
  components: {
    moreLine,
  },
  data() {
    return {
      tableData: [],
      forms: {},
      form: {},
      data: {},
      loading: false,
    };
  },
  mounted() {
    if (this.com == this.index) {
      //this.initCharts();
      this.getNowTime();
    }
  },
  methods: {
    getNowTime() {
      let nowTime = dataTimeFormatFirst();
      this.value1 = [nowTime.old, nowTime.now];
      this.getPtid();
    },
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
      //获取水位过程线
      /*let params = {stcd: window.cfg['hdzs']}
                getWaterLine(params).then(function (r) {
                    if (r.data.data[0].DataList) {
                        let data = r.data.data[0].DataList;
                        that.initCharts([data[0], data[1]]);
                    }

                });*/
      let params = {
        ptid: this.pointid,
        stime: that.value1[0],
        etime: that.value1[1],
        stepUnit: "日",
        step: "1",
        statRule: "水文时间8时",
        statMethod: "期初",
      };
      getPointVal(params).then(function (r) {
        let sData = {};
        let lData = [];
        if (r.data.data.length > 0) {
          let data = r.data.data;
          data.forEach((item) => {
            if (item.valname == "水位") {
              sData = item;
            } else if (item.valname == "流量") {
              lData = item;
            }
          });
          that.initCharts([sData, lData]);
          that.loading = true;
        }
      });
      //防洪指标
      getHdWaterLine(this.ptid).then(function (r) {
        that.form = r.data.data;
      });
      getHdWaterQ(this.ptid).then(function (r) {
        that.data = r.data.data;
        that.tableData = [
          {
            name: "历史最高水位",
            water: that.data.obhtz ? that.data.obhtz : "--",
            num: that.data.obmxq ? that.data.obmxq : "--",
          },
          {
            name: "警戒水位",
            water: that.data.wrz ? that.data.wrz : "--",
            num: that.data.wrq ? that.data.wrq : "--",
          },
          {
            name: "保证水位",
            water: that.data.grz ? that.data.grz : "--",
            num: that.data.grq ? that.data.grq : "--",
          },
          {
            name: "低水位告警值",
            water: that.data.laz ? that.data.laz : "--",
            num: that.data.laq ? that.data.laq : "--",
          },
          {
            name: "高水位告警值",
            water: that.data.taz ? that.data.taz : "--",
            num: that.data.taq ? that.data.taq : "--",
          },
          {
            name: "历史最低水位",
            water: that.data.hlz ? that.data.hlz : "--",
            num: that.data.hmnq ? that.data.hmnq : "--",
          },
        ];
      });
    },
    initCharts(data) {
      let that = this;
      let chart = this.$refs.chart1;
      let chart1 = this.$echarts.init(chart);

      let arrName = [],
        timeArr = [],
        unitArr = {},
        valData = [];
      for (let i = 0, len = data.length; i < len; i++) {
        arrName.push(data[i].valname);
        unitArr[data[i].valname] = data[i].valunit;

        if (i == 0) {
          timeArr = data[i].timeValList.map((item) => {
            let tm = timeFormatToWay(item.tm, "日");
            return tm;
          });
          let num = data[i].timeValList.map((item) => {
            return item.val ? item.val : "";
          });

          let obj = {
            data: num,
            name: data[i].valname,
            unit: data[i].valunit,
            minVal: data[i].minVal,
            maxVal: data[i].maxVal,
          };
          valData.push(obj);
        } else {
          let num = data[i].timeValList.map((item) => {
            return item.val != "null" ? item.val : "";
          });

          let obj = {
            data: num,
            name: data[i].valname,
            unit: data[i].valunit,
            minVal: data[i].minVal,
            maxVal: data[i].maxVal,
          };
          valData.push(obj);
        }
      }
      let option = {
        legend: {
          data: arrName,
          textStyle: {
            //图例文字的样式
            color: "#fff",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          //formatter: '{b}: {c}'
        },
        toolbox: {
          show: true,
          iconStyle: {
            borderColor: "#fff",
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
              excludeComponents: ["toolbox", "dataZoom"],
            },
          },
        },
        /*grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },*/
        dataZoom: [
          {
            show: true,
            realtime: true,
            /*start: 0,
                            end: 70,*/
            textStyle: {
              color: "#18aecd",
            },
          },
          {
            type: "inside",
            realtime: true,
            /*start: 0,
                            end: 70*/
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#fff",
            },
          },
          data: timeArr,
        },
        yAxis: valData.map((item, index) => {
          return {
            name: item.unit == "m" ? "水位(m)" : "流量(m3/s)",
            type: "value",
            //axisLine: {onZero: false},
            axisLabel: {
              formatter: "{value}",
            },
            //设置轴线的属性
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            offset: index > 1 ? 80 : "",
            position: function () {
              if (index > 0) {
                return "right";
              } else {
                return "left";
              }
            },
            min: parseInt(parseInt(item.minVal) * 0.9),
            max: parseInt(parseInt(item.maxVal) * 1.1),
            //boundaryGap: false,
            //interval: Math.ceil(Math.max.apply(null, item.data) / 5),
            data: item.data,
          };
        }),
        series: valData.map((item, index) => {
          return {
            name: item.name,
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowBlur: 10,
              shadowOffsetY: 10,
            },
            yAxisIndex: index,
            itemStyle: {
              color: colorArr[index],
            },
            markPoint: {
              itemStyle: {
                color: colorArr[0],
              },
              label: {
                color: '#fff',
                offset: [0, 0]
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
            data: item.data,
          };
        }),
      };

      chart1.setOption(option);
      // chart1.resize();
      window.addEventListener("resize", function () {
        chart1.resize();
      });
    },
    initCharts2() {
      let chart = this.$refs.chart2;
      let chart1 = this.$echarts.init(chart);

      let option = {
        title: {
          /*text: '漏斗图(对比)',
                        subtext: '纯属虚构',
                        left: 'left',
                        top: 'bottom'*/
        },
        tooltip: {
          show: false,
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },

        series: [
          {
            name: "金字塔",
            type: "funnel",
            width: "55%",
            height: "90%",
            left: "5%",
            top: "5%",

            minSize: "100%",
            maxSize: "1%",
            sort: "descending",
            funnelAlign: "left",
            itemStyle: {
              opacity: 0.5,
              borderColor: "#fff",
              borderWidth: 0,
              color: "#213665",
            },
            label: {
              // padding: [20, -100, 30, 20],
              //position: 'left',
              //show: false,
              color: "#fff",
            },
            labelLine: {
              length: 150,
              lineStyle: {
                color: "#13c7f9",
              },
            },
            center: ["25%", "75%"], // for pie

            data: [
              { value: 80, name: "下游水位" },
              { value: 108, name: "死水位" },
              {
                value: 126,
                name: "实时水位",
                label: { color: "yellow" },
                labelLine: {
                  lineStyle: {
                    color: "yellow",
                  },
                },
              },
              {
                value: 128,
                name: "汛限水位",
                label: { padding: [10, 0, 25, -430] },
                labelLine: {
                  length: 795,
                },
              },
              {
                value: 138,
                name: "设计水位",
                label: { padding: [10, 0, 25, -430] },
                labelLine: {
                  length: 795,
                },
              },
              { value: 140, name: "校核水位" },
            ],
          },

          {
            name: "金字塔",
            type: "funnel",
            width: "55%",
            height: "90%",
            left: "40%",
            top: "5%",
            minSize: "100%",
            maxSize: "1%",
            sort: "descending",
            itemStyle: {
              opacity: 0.5,
              borderColor: "#fff",
              borderWidth: 0,
              color: "#213665",
            },
            funnelAlign: "right",
            label: {
              // padding: [20, -100, 30, 20],
              position: "left",
              show: false,
              color: "#fff",
            },
            center: ["75%", "75%"], // for pie

            data: [
              { value: 80, name: "下游水位" },
              { value: 108, name: "死水位" },
              {
                value: 126,
                name: "实时水位",
                label: { color: "yellow" },
                labelLine: {
                  lineStyle: {
                    color: "yellow",
                  },
                },
              },
              { value: 128, name: "汛限水位" },
              {
                value: 138,
                name: "设计水位",
                label: { padding: [0, 0, 30, 20] },
                labelLine: {
                  length: 200,
                },
              },
              { value: 140, name: "校核水位" },
            ],
          },
        ],
      };

      chart1.setOption(option);
      // chart1.resize();
      window.addEventListener("resize", function () {
        chart1.resize();
      });
    },
  },
  watch: {
    pointid(newval, oldval) {
      if (newval != oldval) {
        this.loading = false;
        this.getNowTime();
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  width: 100%;
  height: 550px;

  .one {
    width: 50%;
    height: 550px;
    float: left;

    .chart1 {
      height: 100%;
      width: 100%;
    }
  }

  .two {
    width: 49.5%;
    height: 300px;
    background: rgba(40, 73, 133, 0.8);
    float: right;

    .chart2 {
      width: 100%;
      height: 100%;
    }

    .view {
      margin: 0;
      width: 573px;
      height: 280px;
      text-align: center;
      background: #26548f;
      padding: 16px 10px 5px;
      overflow: hidden;
      color: #fff;
      line-height: 30px;
    }

    .prBox {
      margin: 0;
      padding: 0;
      position: relative;
      width: 100%;
      height: 100%;
    }

    .view .sw-bg {
      margin: 0;
      padding: 0;
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }

    .lines {
      display: block;
      width: 100%;
      height: 1px;
    }

    .line_blue {
      background: #1f8dc5;
    }

    .bg_yellow {
      background: #dcca21;
    }

    .bg_Orange {
      background: #ed8a18;
    }

    .color_yellow {
      color: #dcca21;
    }

    .color_orange {
      color: #ed8a18;
    }
  }

  .three {
    width: 49.5%;
    height: 250px;
    float: right;
    margin-top: 5px;

    /deep/ .el-form-item__label {
      color: #fff;
    }

    /deep/ .el-table th,
    /deep/ .el-table tr {
      color: #fff;
      background: transparent;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(47, 133, 179, 0.8);
    }

    /deep/ .el-col {
      margin: 5px auto;
    }

    .textL {
      color: #00f8fe;
      display: block;
      text-align: center;
      font-size: 16px;
      margin-bottom: 15px;
    }

    .textN {
      color: #fff;
      display: block;
      text-align: center;
      font-size: 20px;
      line-height: 50px;
    }

    .img-text-big {
      width: 282px;
      height: 50px;
      margin: auto;
      background: url("../../../../assets/images/icon001.jpg") no-repeat;
    }

    .img-text {
      width: 136px;
      height: 50px;
      margin: auto;
      background: url("../../../../assets/images/icon002.jpg") no-repeat;
    }

    /deep/ .el-table td,
    /deep/ .el-table th {
      padding: 5px 0;
    }
  }
}
</style>

