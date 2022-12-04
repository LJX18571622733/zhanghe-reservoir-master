<template>
  <div class="rainfallFlood">
    <el-form
      :model="form"
      class="form-style1 mt-10 timeQuery"
      size="small"
      :inline="true"
    >
      <query-time @changeValue="changeValue"></query-time>
    </el-form>
    <div class="rainfallFloodBox">
      <div class="leftSelect">
        <div class="leftTitle">雨情</div>
        <div class="select form-style1">
          <el-radio-group v-model="rainCondition" @change="getEchartsSeries">
            <el-radio
              :label="item"
              v-for="(item, index) in rainConditionList"
              :key="index"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </div>
        <div class="leftTitle">水情</div>
        <div class="select">
          <el-checkbox-group
            v-model="waterCondition"
            @change="getEchartsSeries"
          >
            <el-checkbox
              :label="item"
              v-for="(item, index) in waterConditionList"
              :key="index"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <!-- 组合图 -->
      <div
        ref="main"
        style="width: calc(100% - 320px); height: 100%"
        v-loading="loading"
      ></div>
    </div>
  </div>
</template>

<script>
import QueryTime from "@/components/_waterRain/queryTime.vue"; //时间
import { getSYQValue, getSYQData } from "@/http/api";
import { mapGetters } from "vuex";
export default {
  components: { QueryTime },
  data() {
    return {
      loading: false,
      form: {},
      rainCondition: "", //雨情
      rainConditionList: [], //雨情
      waterCondition: [], //水情
      waterConditionList: [], //水情
      echartsData: [], //表得数据
      echartSeries: [], //echarts数据
    };
  },
  computed: {
    ...mapGetters({
      sysTheme: "menu/theme",
    }),
  },
  watch: {
    sysTheme() {
      this.rainFloodEchart();
      this.getEchartsSeries()
    },
  },
  mounted() {
    this.getSelectValue();
  },
  methods: {
    // 获取选择详情
    getSelectValue() {
      let that = this;
      getSYQValue().then(function (r) {
        if (r.data.code == 200) {
          let data = r.data.data;
          data["水库"].forEach((el) => {
            el.name = el.v.split("-")[1];
            el.unit = el.v.split("-")[2].split("(")[1].split(")")[0];
            if (el.name == "上游水位") {
              that.waterCondition.push(el);
            }
          });
          data["河道"].forEach((el) => {
            el.name = el.v.split("-")[0].split("河道")[0] + el.v.split("-")[1];
            el.unit = el.v.split("-")[2].split("(")[1].split(")")[0];
          });
          data["雨量"].forEach((el) => {
            el.name = el.v.split("-")[0].split("雨量站")[0];
            el.unit = el.v.split("-")[2].split("(")[1].split(")")[0];
            if (el.name == "面雨量") {
              that.rainCondition = el;
            }
          });
          // 面雨量不展示
          that.waterConditionList = data["水库"].concat(data["河道"]);
          that.rainConditionList = data["雨量"];
        } else {
          that.$message.error(r.data.msg);
        }
      });
    },
    changeValue(val) {
      if (val.time === null) {
        this.$message.info("请先选择起止时间");
      } else {
        let that = this;
        that.form = val;
      }
      this.getEchartsData();
    },
    getEchartsSeries() {
      let that = this;
      that.echartSeries = [];
      that.echartSeries[0] = {
        yAxisIndex: 1,
        type: "bar",
        barWidth: "40%",
        name: that.rainCondition.name,
        itemStyle: {
          normal: {
            color: "#5C7BD9",
          },
        },
        data: that.echartsData.map((item) => {
          return [item.tm, item[that.rainCondition.k]];
        }),
        markPoint: {
          symbol: "circle",
          symbolSize: 0,
          symbolOffset: [0, 20],
          itemStyle: {
            color: this.sysTheme == "light" ? "#000" : "#fff",
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
      };
      that.waterCondition.forEach((el) => {
        that.echartSeries.push({
          type: "line",
          name: el.name,
          data: that.echartsData.map((item) => {
            return [item.tm, item[el.k]];
          }),
          markPoint: {
            symbol: "circle",
            symbolSize: 0,
            symbolOffset: [0, -20],
            itemStyle: {
              color: "#fff",
              borderColor: "#999",
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
        });
      });
      that.rainFloodEchart();
    },
    getEchartsData() {
      var that = this;
      this.loading = true;
      getSYQData({
        endTime: that.form.time[1],
        startTime: that.form.time[0],
        timeTypeEnum: that.form.statisticalMethod,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.echartsData = r.data.data;
            that.getEchartsSeries();
          } else {
            that.$message.error(r.data.msg);
          }
          that.loading = false;
        })
        .catch(function (err) {
          that.$message.error(err.response.data.msg);
          that.tableLoading = false;
        });
    },
    // 面雨量组合柱状图
    rainFloodEchart() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(that.$refs.main, "light");
      myChart.clear();
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: "雨洪对照图",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        grid: [
          {
            top: 40,
            left: 80,
            right: 80,
            bottom: 80,
          },
        ],
        xAxis: [
          {
            type: "category",
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "水位(m)",
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
            inverse: true,
            type: "value",
            name: "降雨量(mm)",
            nameLocation: "start",
            max: function (value) {
              return Math.ceil(value.max) * 2;
            },
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
        series: that.echartSeries,
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
  },
};
</script>

<style lang="scss" scoped>
.rainfallFlood {
  display: flex;
  flex-direction: column;
  @include styles("background-color", "blockBg");
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  .rainfallFloodBox {
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex: 1;
    overflow-y: auto;
    .leftSelect {
      width: 300px;
      height: 100%;
      padding: 10px 0;
      box-sizing: border-box;
      .leftTitle {
        font-weight: 600;
        background: linear-gradient(to bottom right, #33b0ff, #5470c6);
        border-radius: 3px;
        // @include styles("background-color", "boxBgColor2");
        color: #fff;
        text-align: center;
        height: 40px;
        line-height: 40px;
        // @include styles("border-color", "treeBorder");
        &:first-child {
          border-top: 1px solid transparent;
          @include styles("border-color", "treeBorder");
        }
      }
      .select {
        padding: 40px 0 30px;
        border: 1px solid transparent;
        border-top: 0;
        @include styles("border-color", "treeBorder");
        .el-radio-group {
          display: flex;
          flex-direction: column;
          .el-radio {
            margin: 0 0 10px 40px;
          }
        }
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
          .el-checkbox {
            margin: 0 0 10px 40px;
          }
        }
      }
    }
  }
}
</style>