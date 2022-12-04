<template>
  <div class="histogram">
    <!-- 面雨量组合柱状图 -->
    <div id="main" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getArealRainfall, getArealRainfallDetail } from "@/http/api";
import { timeFormatToWay } from "@/common/common";
import fecha from "fecha";
export default {
  name: "arealRainfallHistogram",
  props: ["rainfall", "showTable"],
  data() {
    return {
      form: {},
      detailTime: "", //柱状图点击时间
      detailType: "", //柱状图点击类型（逐日，逐月）
      arealRainfall: {}, //面雨量数据
      lastHistogramData: [], //最后一个柱状图的数据
      lastHistogramXData: [], //最后一个柱状图的X轴数据
      echartsOption: {}, //图标的option配置
      color: [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ],
    };
  },
  computed: {
    ...mapGetters({
      sysTheme: "menu/theme",
    }),
  },

  components: {},

  watch: {
    sysTheme() {
      this.arealRainfallEchart();
    },
    showTable() {
      if (!this.showTable) {
        this.arealRainfallEchart();
      }
    },
  },
  mounted() {
    window.addEventListener("keyup", this.keyDown);
  },
  destroyed() {
    window.removeEventListener("keyup", this.keyDown);
  },

  methods: {
    // 获取面雨量柱状图
    getArealRainfallData(form) {
      let that = this;
      that.form = form;
      if (form.time[0].length == 13) {
        form.time[0] = form.time[0] + ":00:00";
        form.time[1] = form.time[1] + ":00:00";
      }
      getArealRainfall({
        endTime: form.time[1],
        startTime: form.time[0],
        timeTypeEnum: that.form.statisticalMethod,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.arealRainfall = r.data.data;
            if (that.arealRainfall.miniDrpInfo === null) {
              that.arealRainfall.miniDrpInfo = {};
              that.arealRainfall.miniDrpInfo.valTimeDtos = [];
            }
            if (that.arealRainfall.mssk12DrpInfo.valTimeDtos.length >= 1) {
              that.detailTime =
                that.arealRainfall.mssk12DrpInfo.valTimeDtos[
                  that.arealRainfall.mssk12DrpInfo.valTimeDtos.length - 1
                ].tm;
              that.getArealRainfallDetailData();
            } else {
              that.lastHistogramData = [];
              that.arealRainfallEchart();
            }
            that.detailType = that.form.statisticalMethod;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error(err.response.data.msg);
        });
    },
    getArealRainfallDetailData() {
      let that = this;
      let time = that.detailTime;
      if (that.detailTime.length == 13) {
        time = that.detailTime + "00:00";
      }
      if (that.detailTime.length == 10) {
        time = that.detailTime + " 00:00:00";
      } else if (that.detailTime.length == 7) {
        time = that.detailTime + "-01 00:00:00";
      } else if (that.detailTime.length == 4) {
        time = that.detailTime + "-01-01 00:00:00";
      }
      if (that.detailType == "") {
        that.detailType = that.form.statisticalMethod;
      }
      getArealRainfallDetail({
        endTime: time,
        startTime: time,
        timeTypeEnum: that.detailType,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.lastHistogramXData = [];
            that.lastHistogramData = [];
            that.rainfall.forEach((el) => {
              for (var k in r.data.data) {
                if (el.k == k) {
                  that.lastHistogramXData.push(el.name.split("雨量")[0]);
                  that.lastHistogramData.push(r.data.data[k]);
                }
              }
            });
            that.arealRainfallEchart();
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error(err.response.data.msg);
        });
    },
    // 面雨量组合柱状图
    arealRainfallEchart() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        title: [
          {
            left: "35%",
            text:
              (that.form.statisticalMethod == "HOUR"
                ? "逐小时"
                : that.form.statisticalMethod == "DAY"
                ? "逐日"
                : that.form.statisticalMethod == "MONTH"
                ? "逐月"
                : "逐年") + "降雨量（mm）",
            textStyle: {
              fontSize: 14,
              color: this.sysTheme == "light" ? "#333" : "#fff",
              fontWeight: 500,
            },
          },
          {
            text: that.detailTime + "降雨量（mm）",
            bottom: "2",
            left: "40%",
            textStyle: {
              fontSize: 14,
              color: this.sysTheme == "light" ? "#333" : "#fff",
              fontWeight: 500,
            },
          },
          {
            right: "10%",
            text:
              this.arealRainfall.mssk12DrpInfo.valTimeDtos.length > 1
                ? this.arealRainfall.mssk12DrpInfo.valTimeDtos[
                    this.arealRainfall.mssk12DrpInfo.valTimeDtos.length - 1
                  ].tm + "降雨量（mm）"
                : "",
            textStyle: {
              fontSize: 14,
              color: this.sysTheme == "light" ? "#333" : "#fff",
              fontWeight: 500,
            },
          },
        ],
        toolbox: {
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
          feature: {
            saveAsImage: {
              show: true,
              type: "png",
              title: "保存为图片",
            },
          },
        },
        tooltip: [
          {
            trigger: "axis",
            formatter: function (params) {
              let tm = "";
              let val = "";
              if (params[0].axisIndex == 0) {
                tm = params[0].axisValue;
                val = params[0].value;
              } else if (params[0].axisIndex == 1) {
                tm = that.detailTime + " " + params[0].axisValue;
                val = params[0].value;
              } else if (params[0].axisIndex == 2) {
                tm = params[0].value[0];
                val = params[0].value[1];
              }
              return tm + " : " + val + "mm";
            },
          },
        ],
        grid: [
          {
            top: "13%",
            left: 50,
            right:
              that.form.statisticalMethod == "HOUR" ||
              that.form.statisticalMethod == "DAY"
                ? "50"
                : "25%",
            height: "35%",
          },
          {
            left: 50,
            right:
              that.form.statisticalMethod == "HOUR" ||
              that.form.statisticalMethod == "DAY"
                ? "50"
                : "25%",
            top: "53%",
            height: "35%",
          },
          {
            top: "13%",
            left: "75%",
            height: "75%",
            right: 50,
            // show:
            //   that.form.statisticalMethod == "HOUR" ||
            //   that.form.statisticalMethod == "DAY"
            //     ? false
            //     : true,
            //      borderColor: '#000'
          },
        ],
        xAxis: [
          {
            // type: "time",
            gridIndex: 0,
            position: "top",
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            splitLine: { show: false },
            data: this.arealRainfall.mssk12DrpInfo.valTimeDtos.map((item) => {
              return item.tm;
            }),
            // axisLabel: {
            // formatter: function (value) {
            //   console.log(value);
            //   let tm = fecha.format(value, "YYYY-MM-DD hh:mm:ss");
            //   return timeFormatToWay(
            //     tm,
            //     that.form.statisticalMethod == "HOUR"
            //       ? "小时"
            //       : that.form.statisticalMethod == "DAY"
            //       ? "日"
            //       : that.form.statisticalMethod == "MONTH"
            //       ? "月"
            //       : "年"
            //   );
            // },
            // },
          },
          {
            gridIndex: 1,
            data: this.lastHistogramXData,
            axisTick: {
              show: false,
            }, //不显示刻度线
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          {
            gridIndex: 2,
            type: "time",
            position: "top",
            splitLine: { show: false },
            // show:
            //   that.form.statisticalMethod == "HOUR" ||
            //   that.form.statisticalMethod == "DAY"
            //     ? false
            //     : true,
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            axisLabel: {
              show: false,
              color: "transparent",
              // formatter: function (value) {
              //   let tm = fecha.format(value, "YYYY-MM-DD hh:mm:ss");
              //   return timeFormatToWay(
              //     tm,
              //     that.form.statisticalMethod == "HOUR"
              //       ? "小时"
              //       : that.form.statisticalMethod == "DAY"
              //       ? "小时"
              //       : that.form.statisticalMethod == "MONTH"
              //       ? "小时"
              //       : "日"
              //   );
              // },
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            inverse: true,
            // splitLine: { show: false },
            axisTick: {
              show: true,
            }, //显示刻度线
            axisLine: {
              show: true, //显示坐标线
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          {
            gridIndex: 1,
            position: "right",
            // splitLine: { show: false },
            axisTick: {
              show: true,
              inside: true, //刻度线在内测
            }, //显示刻度线
            axisLine: {
              show: true, //显示坐标线
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          {
            gridIndex: 2,
            position: "right",
            // splitLine: { show: false },
            inverse: true,
            show:
              that.form.statisticalMethod == "HOUR" ||
              that.form.statisticalMethod == "DAY"
                ? false
                : true,
            axisTick: {
              show: true,
            }, //显示刻度线
            axisLine: {
              show: true, //显示坐标线
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
        ],

        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: "40%",
            type: "bar",
            data: this.arealRainfall.mssk12DrpInfo.valTimeDtos.map((item) => {
              return item.val;
            }),
            markPoint: {
              symbol: "circle",
              symbolSize: 0,
              symbolOffset: [0, 0],
              itemStyle: {
                color: "#000",
              },
              label: {
                color: this.sysTheme == "light" ? "#000" : "#fff",
                offset: [0, 12],
              },
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var color = "#5C7BD9";
                  if (that.detailTime == params.name) {
                    color = "#3392ff";
                  } else {
                    if (that.form.statisticalMethod === "HOUR") {
                      if (params.value !== undefined && params.value > 100) {
                        color = "#ff8000";
                      }
                    } else if (that.form.statisticalMethod === "DAY") {
                      if (params.value !== undefined && params.value > 300) {
                        color = "#ff8000";
                      }
                    } else if (that.form.statisticalMethod === "MONTH") {
                      if (params.value !== undefined && params.value > 1000) {
                        color = "#ff8000";
                      }
                    } else if (
                      params.value !== undefined &&
                      that.form.statisticalMethod === "YEAR"
                    ) {
                      if (params.value > 3000) {
                        color = "#ff8000";
                      }
                    }
                  }
                  return color;
                },
              },
            },
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            barWidth: "40",
            data: this.lastHistogramData,
            label: {
              // show: true,
              position: "top",
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
            markPoint: {
              symbol: "circle",
              symbolSize: 0,
              symbolOffset: [0, 0],
              itemStyle: {
                color: "#000",
              },
              label: {
                color: this.sysTheme == "light" ? "#000" : "#fff",
                offset: [0, -12],
              },
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  // var color = "#5C7BD9";
                  // if (that.detailType === "HOUR") {
                  //   if (params.value !== undefined && params.value > 100) {
                  //     color = "#ff8000";
                  //   }
                  // } else if (that.detailType === "DAY") {
                  //   if (params.value !== undefined && params.value > 300) {
                  //     color = "#ff8000";
                  //   }
                  // } else if (that.detailType === "MONTH") {
                  //   if (params.value !== undefined && params.value > 1000) {
                  //     color = "#ff8000";
                  //   }
                  // } else if (
                  //   params.value !== undefined &&
                  //   that.detailType === "YEAR"
                  // ) {
                  //   if (params.value > 3000) {
                  //     color = "#ff8000";
                  //   }
                  // }
                  // return color;
                  return that.color[params.dataIndex];
                },
              },
            },
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            show:
              that.form.statisticalMethod == "HOUR" ||
              that.form.statisticalMethod == "DAY"
                ? false
                : true,
            itemStyle: {
              normal: {
                color: function (params) {
                  var color = "#5C7BD9";
                  if (that.detailTime == params.value[0]) {
                    color = "#3392ff";
                  } else {
                    if (that.form.statisticalMethod === "MONTH") {
                      if (
                        params.value[1] !== undefined &&
                        params.value[1] > 300
                      ) {
                        color = "#ff8000";
                      }
                    } else if (
                      params.value[1] !== undefined &&
                      that.form.statisticalMethod === "YEAR"
                    ) {
                      if (params.value[1] > 1000) {
                        color = "#ff8000";
                      }
                    }
                  }

                  return color;
                },
              },
            },
            markPoint: {
              symbol: "circle",
              symbolSize: 0,
              symbolOffset: [0, 0],
              itemStyle: {
                color: "#000",
              },
              label: {
                color: this.sysTheme == "light" ? "#000" : "#fff",
                offset: [0, 12],
              },
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            data:
              that.form.statisticalMethod == "HOUR" ||
              that.form.statisticalMethod == "DAY"
                ? []
                : this.arealRainfall.miniDrpInfo.valTimeDtos.map((item) => {
                    return [item.tm, item.val];
                  }),
          },
        ],
      };
      myChart.off("click"); //调用click前先用off,解决重复调用bug
      myChart.on("click", function (params) {
        if (params.seriesIndex == 0) {
          that.detailTime = params.name;
          that.detailType = that.form.statisticalMethod;
          that.getArealRainfallDetailData();
        } else if (params.seriesIndex == 2) {
          that.detailTime = params.value[0];
          if (that.form.statisticalMethod == "MONTH") {
            that.detailType = "DAY";
          } else if (that.form.statisticalMethod == "YEAR") {
            that.detailType = "MONTH";
          }
          that.getArealRainfallDetailData();
        }
      });
      this.echartsOption = option;

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
    keyDown(e) {
      let that = this;
      // 箭头左键
      if (e.keyCode == 37) {
        // 表示高亮的柱子在逐年降雨量中
        if (
          this.detailTime.length ==
          // this.echartsOption.series[0].data[0][0].length
          this.echartsOption.xAxis[0].data[0].length
        ) {
          // 逐年降雨量的数据大于1个做循环
          this.enterRight();
        } else if (
          this.detailTime.length ==
          this.echartsOption.series[2].data[0][0].length
        ) {
          // 表示高亮的柱子在某个具体值的降雨量中
          if (this.arealRainfall.miniDrpInfo.valTimeDtos.length > 1) {
            this.arealRainfall.miniDrpInfo.valTimeDtos.forEach(
              (item, index) => {
                if (item.tm == this.detailTime) {
                  if (index > 0) {
                    this.detailTime =
                      this.arealRainfall.miniDrpInfo.valTimeDtos[index - 1].tm;
                    this.getArealRainfallDetailData();
                  } else if (index == 0) {
                    // 当高亮柱子走到最前面
                    if (
                      this.arealRainfall.mssk12DrpInfo.valTimeDtos.length > 0
                    ) {
                      this.detailTime =
                        this.arealRainfall.mssk12DrpInfo.valTimeDtos[
                          this.arealRainfall.mssk12DrpInfo.valTimeDtos.length -
                            1
                        ].tm;
                      if (that.detailType == "DAY") {
                        that.detailType = "MONTH";
                      } else if (that.detailType == "MONTH") {
                        that.detailType = "YEAR";
                      }
                      this.getArealRainfallDetailData();
                    }
                  }
                }
              }
            );
          }
        }
      } else if (e.keyCode == 39) {
        // 箭头右键
        // 高亮在降雨量中
        if (
          this.detailTime.length ==
          // this.echartsOption.series[0].data[0][0].length
          this.echartsOption.xAxis[0].data[0].length
        ) {
          if (this.arealRainfall.mssk12DrpInfo.valTimeDtos.length >= 1) {
            try {
              this.arealRainfall.mssk12DrpInfo.valTimeDtos.forEach(
                (item, index) => {
                  if (item.tm == this.detailTime) {
                    if (
                      index <
                      this.arealRainfall.mssk12DrpInfo.valTimeDtos.length - 1
                    ) {
                      this.detailTime =
                        this.arealRainfall.mssk12DrpInfo.valTimeDtos[
                          index + 1
                        ].tm;
                      this.getArealRainfallDetailData();
                      throw new Error("LoopTerminates");
                    } else if (
                      index ==
                      this.arealRainfall.mssk12DrpInfo.valTimeDtos.length - 1
                    ) {
                      // 当高亮的柱子在降雨量中最后一个跳转到具体降雨量中
                      if (
                        this.arealRainfall.miniDrpInfo.valTimeDtos.length > 1
                      ) {
                        if (
                          that.detailType == "MONTH" ||
                          that.detailType == "YEAR"
                        ) {
                          if (that.detailType == "MONTH") {
                            that.detailType = "DAY";
                          } else if (that.detailType == "YEAR") {
                            that.detailType = "MONTH";
                          }
                          this.detailTime =
                            this.arealRainfall.miniDrpInfo.valTimeDtos[0].tm;
                          this.getArealRainfallDetailData();
                        }
                      }
                    }
                  }
                }
              );
            } catch (e) {
              if (e.message !== "LoopTerminates") throw e;
            }
          }
        } else if (
          this.detailTime.length ==
          this.echartsOption.series[2].data[0][0].length
        ) {
          // 高亮的柱子在具体降雨量中
          if (this.arealRainfall.miniDrpInfo.valTimeDtos.length > 1) {
            try {
              this.arealRainfall.miniDrpInfo.valTimeDtos.forEach(
                (item, index) => {
                  if (item.tm == this.detailTime) {
                    if (
                      index <
                      this.arealRainfall.miniDrpInfo.valTimeDtos.length - 1
                    ) {
                      this.detailTime =
                        this.arealRainfall.miniDrpInfo.valTimeDtos[
                          index + 1
                        ].tm;
                      this.getArealRainfallDetailData();
                      throw new Error("LoopTerminates");
                    }
                  }
                }
              );
            } catch (e) {
              if (e.message !== "LoopTerminates") throw e;
            }
          }
        }
      }
    },
    // 逐年降雨量的数据大于1个做循环
    enterRight() {
      if (this.arealRainfall.mssk12DrpInfo.valTimeDtos.length > 1) {
        this.arealRainfall.mssk12DrpInfo.valTimeDtos.forEach((item, index) => {
          if (item.tm == this.detailTime) {
            if (index > 0) {
              this.detailTime =
                this.arealRainfall.mssk12DrpInfo.valTimeDtos[index - 1].tm;
              this.getArealRainfallDetailData();
            }
          }
        });
      }
    },
  },
};
</script>

<style scoped lang='scss'>
</style>