<template>
  <div class="chart1" ref="chart1"></div>
</template>

<script>
  import {colorArr} from './colors'
export default {
  name: "ibar-line",
  props: ["dataList", "color", "com", "index"],
  data() {
    return {
      colorArr,
    }
  },
  mounted() {
    if (this.com == this.index) {
      this.initCharts();
    }
  },
  methods: {
    initCharts() {
      var that = this;
      let chart = this.$refs.chart1;
      let chart1 = this.$echarts.init(chart);
      let option = {
        grid: {
          left: 30,
          right: 20,
          top: 10,
          bottom: 20,
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          axisLabel: {
            formatter: function (value, index) {
              // 格式化成月/日，只在第一个刻度显示年份
              var date = new Date(value);
              var texts = [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
              ];
              return texts.join("-");
            },
          },
        },
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100,
            xAxisIndex: 0,
          },
        ],
        yAxis: [{
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          inverse: true,
        },{
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
        }],
        series: [
          {
            data: this.dataList.map(function (item) {
              return [item["tm"], item["val"]];
            }),
            type: "bar",
            symbol: "none",
            itemStyle: {
              color: "#3398DB",
            },
          },      {
            data: this.dataList.map(function (item) {
              return [item["tm"], item["val"]];
            }),
            type: "line",
            symbol: "none",
            yAxisIndex:1,
            itemStyle: {
              color: "#3398DB",
            },
          }
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
    com(newval, oldval) {
      if (newval == this.index) {
        this.initCharts();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chart1 {
  height: 100%;
  width: 100%;
}
</style>
