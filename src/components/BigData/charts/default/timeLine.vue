<template>
  <div class="chart1 flex-1" ref="chart1" @dblclick="dbClick"></div>
</template>

<script>
import { colorArr } from "./colors";
import { timeFormatToWay, getGranularity } from "@/common/common";
import { maxMinStep } from "@/common/mathCharts";
import fecha from "fecha";

export default {
  name: "time-line",
  // props: ["dataList", "color","mtnm","unit", "mpcd"],
  props: ["item"],
  data() {
    return {
      colorArr,
    };
  },
  mounted() {
    this.initCharts();
    // console.log(this.dataList, this.color, this.mtnm, this.unit, this.mpcd)
  },
  methods: {
    initCharts() {
      //   let arr = this.dataList.map(item => { return item.Val})
      //  let  mms=maxMinStep(arr);
      /*let maxX = Math.floor(Math.max.apply(null, arr.map(Number)))
      let minX = Math.ceil(Math.min.apply(null, arr.map(Number)))
      let num = Math.floor((maxX - minX)/200)

      if(Math.floor((maxX - minX)/200) > 0){
        num = 200
      }else if(Math.floor((maxX - minX)/100) > 0){
        num = 100
      }else if(Math.floor((maxX - minX)/50) > 0){
        num = 50
      }else if(Math.floor((maxX - minX)/30) > 0){
        num = 30
      }else if(Math.floor((maxX - minX)/20) > 0){
        num = 20
      }else if(Math.floor((maxX - minX)/10) > 0){
        num = 10
      }else if(Math.floor((maxX - minX)/5) > 0){
        num = 5
      }else if(Math.floor((maxX - minX)/2) > 0){
        num = 2
      }else  {
        num = 1
      }*/

      var that = this;
      let chart = this.$refs.chart1;
      let chart1 = this.$echarts.init(chart, null, { locale: "ZH" });
      chart1.clear();
      let res = this.item;
      let granularity = getGranularity(res.timeValList);
      let option = {
        animationThreshold: 10000, //超过就没有动画效果
        animationDuration: 2000,
        grid: {
          left: 60,
          right: 30,
          top: 10,
          bottom: 20,
        },
        legend: {
          show: true,
          left: 30,
          top: -6,
          icon: "none",
          textStyle: {
            color: "#fff",
          },
          formatter: function (name) {
            return res.ptcd;
          },
        },
        title: {
          show: false,
          text: res.valName + res.ptcd + "实测过程线",
          left: "center",
          bottom: 0,
          textStyle: {
            color: "#eee",
            fontSize: 12,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          // formatter: function(params){
          //   console.log(params, 'params')
          //   let tm = timeFormatToWay(params[0].axisValue,'日')
          //   return "时间：" + tm + " <br/>" + params[0].seriesName.split(',')[0] + ': '+ params[0].value + params[0].seriesName.split(',')[1]
          // }
          formatter: function (params) {
            // let tm = timeFormatToWay(params[0].value[0], step)
            let tm = params[0].value[0];
            return (
              "时间： " +
              tm +
              "<br>" +
              res.valName +
              "： " +
              (params[0].value[1] ? params[0].value[1] : "--") +
              " (" +
              res.valunit +
              ")"
            );
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
          },
          {
            show: false,
            start: 0,
            textStyle: {
              color: "#18aecd",
            },
          },
        ],
        toolbox: {
          show: false,
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
        xAxis: [
          {
            type: "time",
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#18aecd",
                width: 2,
              },
            },
            axisTick: {
              show: false,
            },
            // axisLabel: {
            //   color: "#00ffff",
            //   // formatter: function (value, index) {
            //   //   // 格式化成月/日，只在第一个刻度显示年份
            //   //   var date = new Date(value);
            //   //   var texts = [date.getFullYear(), date.getMonth() + 1];
            //   //   return texts.join("-");
            //   // },
            //   formatter: function (value) {
            //     let tm = fecha.format(value, "YYYY-MM-DD HH:mm:ss");
            //     console.log(timeFormatToWay(tm, granularity));
            //     return timeFormatToWay(tm, granularity);
            //   },
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "(" + res.valunit + ")",
            nameLocation: "start",
            nameGap: 10,
            nameTextStyle: {
              align: "right",
              padding: [0, 15],
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#18aecd",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#18aecd",
                width: 2,
                onZero: false,
              },
            },
            axisLabel: {
              color: "#00ffff",
              // y轴得值保留两位小数
              formatter: function (value) {
                return value.toFixed(2);
              },
            },
            /*min:(Math.floor((maxX - minX)/200) > 0 || Math.floor((maxX - minX)/100) > 0) ? (Math.floor(minX/100))*100 : (minX -1),
          max:(Math.floor((maxX - minX)/200) > 0 || Math.floor((maxX - minX)/100) > 0) ? (Math.floor(maxX/100))*100 : (maxX + 1),
          interval:num,*/
            // min:mms.min,
            // max:mms.max,
            // interval:mms.step,
            min: res.yminVal,
            max: res.ymaxVal,
            interval: res.ykedu, //强制设置坐标轴分割间隔
          },
        ],
        // minValue - maxValue 正常值范围内正常颜色
        // 正常值范围外 红色
        visualMap: {
          show: false,
          pieces: [
            {
              gte: res.minValue ? res.minValue : res.minVal,
              lte: res.maxValue ? res.maxValue : res.maxVal,
              color: res.chartColor ? res.chartColor : colorArr[10],
            },
            {
              lt: res.minValue ? res.minValue : res.minVal,
              color: "red",
            },
            {
              gt: res.maxValue ? res.maxValue : res.maxVal,
              color: "red",
            },
          ],
        },
        series: [
          {
            name: res.valName + "," + res.valunit,
            data: res.timeValList.map((item) => {
              // return [item.tm, item.val != 'null' ? item.val : '']
              return [item.tm, item.val];
            }),
            type: "line",
            // connectNulls: true, //连接空数据
            symbolSize: 2,
            animation: true,
            // symbol: "none",
            lineStyle: {
              color: res.chartColor,
            },
            areaStyle: {
              // color: {
              //   type: "linear",
              //   x: 0,
              //   y: 0,
              //   x2: 0,
              //   y2: 1,
              //   colorStops: [
              //     {
              //       offset: 0.6,
              //       color: that.color, // 0% 处的颜色
              //     },
              //     {
              //       offset: 1,
              //       color:"rgba(128, 128, 128, 0.0)", // 100% 处的颜色
              //     },
              //   ],
              //   global: false, // 缺省为 false
              // },
              // color: that.color,
              // opacity: 0.2
              opacity: 0,
            },
            // 标记最大值最小值
            // markPoint: {
            //   symbol: "circle",
            //   symbolSize: 5,
            //   symbolOffset: [0, 0],
            //   itemStyle: {
            //     color: "#fff",
            //   },
            //   label: {
            //     color: '#fff',
            //     offset: [0, -12]
            //   },
            //   data: [
            //     { type: "max", name: "Max" },
            //     { type: "min", name: "Min" },
            //   ],
            // },
            markLine: {
              silent: true,
              lineStyle: {
                color: "#18aecd",
              },
              data: [
                {
                  label: {
                    position: "middle",
                    distance: 0,
                    formatter: "{c}" + res.valunit,
                    // show: false
                  },
                  yAxis: res.minValue ? res.minValue : res.minVal,
                },
                {
                  label: {
                    position: "middle",
                    distance: 0,
                    formatter: "{c}" + res.valunit,
                    // show: false
                  },
                  yAxis: res.maxValue ? res.maxValue : res.maxVal,
                },
              ],
            },
          },
        ],
      };
      chart1.setOption(option);
      // chart1.resize();
      // window.addEventListener("resize", function () {
      //   chart1.resize();
      // });
    },
    dbClick() {
      this.$emit("dbClick");
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
