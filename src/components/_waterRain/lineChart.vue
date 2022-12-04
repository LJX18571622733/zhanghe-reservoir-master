<template>
  <!-- 降雨柱状图 -->
  <div class="rainfallHistogram" ref="rainfallHistogram">
    <div id="chart" ref="chart" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { timeFormatToWay, getGranularity } from "@/common/common";
import fecha from "fecha";
export default {
  name: "rainfallHistogram",
  props: ["item", "showTable"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      sysTheme: "menu/theme",
    }),
  },
  watch: {
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
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart);
      myChart.clear();
      let granularity = getGranularity(this.item.valTimeDtos);
      var option = {
        title: [
          {
            left: "50%",
            text: this.item.name + "柱状图",
            bottom: 20,
            textStyle: {
              fontSize: 12,
              color: "#999",
              fontWeight: 500,
            },
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let tm = params[0].value[0];
            let val = params[0].value[1];
            return tm + " " + params[0].seriesName + " " + val + "m";
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
            type: "time",
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value) {
                let tm = fecha.format(value, "YYYY-MM-DD hh:mm:ss");
                return timeFormatToWay(tm, granularity);
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
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
              return [item.tm, item.val];
            }),
            itemStyle: {
              color: "#5C7BD9",
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