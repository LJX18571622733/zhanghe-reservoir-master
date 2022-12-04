<template>
  <!-- 降雨柱状图 -->
  <div class="rainfallHistogram" ref="rainfallHistogram">
    <div id="chart" ref="chart" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "rainfallHistogram",
  props: ["item", "showTable", "rainfallData"],
  data() {
    return {
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
  watch: {
    sysTheme() {
      this.arealRainfall();
    },
    showTable() {
      this.$nextTick(() => {
        if (!this.showTable) {
          this.arealRainfall();
        }
      });
    },
  },

  mounted() {
    this.arealRainfall();
  },

  methods: {
    // 面雨量组合柱状图
    arealRainfall() {
      let that = this;
      let rainfallData = [];

      that.rainfallData.forEach((el) => {
        if (el.name !== "库区雨量" && el.name !== "面雨量") {
          rainfallData.push(el.name);
        }
      });
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart);
      myChart.clear();
      var option = {
        title: [
          {
            left: "50%",
            text: this.item.name + "降雨量柱状图",
            bottom: 20,
            textStyle: {
              fontSize: 12,
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
            saveAsImage: { show: true, type: "png", title: "保存为图片" },
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            return (
              params[0].axisValue +
              " " +
              params[0].seriesName +
              " " +
              params[0].value +
              "mm"
            );
          },
        },
        grid: [
          {
            top: 50,
            left: 50,
            right: 50,
            bottom: 70,
          },
        ],
        xAxis: [
          {
            position: "top",
            // type: "time",

            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            splitLine: {
              show: false,
            },
            data: this.item.valTimeDtos.map((item) => {
              return item.tm;
            }),
            // axisLabel: {
            //   formatter: function (value) {
            //     let tm = fecha.format(value, "YYYY-MM-DD hh:mm:ss");
            //     return timeFormatToWay(tm, granularity);
            //   },
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：mm",
            gridIndex: 0,
            max: this.item.ymaxVal,
            min: this.item.yminVal,
            interval: this.item.ykeDu,
            inverse: true,
            splitLine: { show: false },
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
            name: this.item.name,
            type: "bar",
            data: this.item.valTimeDtos.map((item) => {
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
            barWidth: "40%",
            itemStyle: {
              color: function (params) {
                var color = "";
                rainfallData.forEach((el, index) => {
                  if (that.item.name == el) {
                    color = that.color[index];
                  }
                });
                return color;
              },
            },
          },
        ],
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
  },
};
</script>

<style scoped lang='scss'>
</style>