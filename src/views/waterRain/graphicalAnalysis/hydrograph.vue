<template>
  <!-- 测站分布图 -->
  <div class="query flex-col-layout" v-loading="loading" ref="query">
    <el-form
      :model="form"
      class="form-style1 timeQuery"
      size="small"
      :inline="true"
    >
      <query-time @changeValue="changeValue"></query-time>
      <el-form-item>
        <el-button size="small" @click="exportExcel"
          >导出</el-button
        >
      </el-form-item>
      <el-form-item class="formButton">
        <el-button type="primary" size="small" @click="changeShowTable">{{
          showTable ? "过程线" : "数据表"
        }}</el-button>
        <!-- <el-button type="primary" size="small" @click="changeEcharts">{{
          showMorePicture ? "多图单线" : "单图多线"
        }}</el-button> -->
      </el-form-item>
    </el-form>
    <div class="query_content">
      <el-form :model="objectForm" class="form-style1">
        <el-form-item label="水库：">
          <el-checkbox-group v-model="objectForm.reservoir">
            <el-checkbox
              v-for="(item, index) in reservoirs"
              :key="'4' + index"
              :label="item"
              @change="getReservoirData(item, index, $event)"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="河道：">
          <el-checkbox-group v-model="objectForm.riverway">
            <el-checkbox
              v-for="(item, index) in rivers"
              :key="'2' + index"
              :label="item"
              @change="getRainsData(item, index, $event)"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>

      <!-- 多图单线 -->
      <div class="echartsBox" v-loading="loadingTable" ref="chartWrapper">
        <!-- 水库变化过程线 -->
        <div
          v-for="item in shuikuData"
          :key="item.id"
          class="lineChart"
          v-show="item.show"
        >
          <div class="charts" ref="chart"></div>
          <div class="chartsInfo">
            <div class="info">
              <div class="infoTitle">最大值：</div>
              {{ item.maxVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.maxValTm }}
            </div>
            <div class="info">
              <div class="infoTitle">最小值：</div>
              {{ item.minVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.minValTm }}
            </div>
          </div>
        </div>
        <!-- <div v-for="item in shuikuData" :key="item.id" class="lineChart" :style="'height: ' + item.show ? '300px' : '0'">
          <div class="charts" ref="chart"></div>
        </div> -->

        <!-- 河道变化过程线 -->
        <div
          v-for="item in hedaoData"
          :key="item.id"
          class="lineChart"
          v-show="item.show"
        >
          <div class="charts" ref="charts"></div>
          <div class="chartsInfo">
            <div class="info">
              <div class="infoTitle">最大值：</div>
              {{ item.maxVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.maxValTm }}
            </div>
            <div class="info">
              <div class="infoTitle">最小值：</div>
              {{ item.minVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.minValTm }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          hedaoData.length + shuikuData.length == 0 &&
          echartsLoading === false &&
          loadingTable === false &&
          showTable === false
        "
        class="noData"
      >
        暂无数据
      </div>
      <div
        ref="singlePicture"
        v-loading="echartsLoading"
        class="singlePicture"
        v-show="hedaoData.length + shuikuData.length !== 0"
      >
        <!-- 单图多线 -->
        <div ref="onePicture" class="onePicture"></div>
      </div>

      <div class="tableData" v-loading="loadingTable" ref="table">
        <el-table
          :data="tableData"
          style="width: calc(100% - 40px)"
          border
          size="small"
          height="calc(100% - 40px)"
          id="out-table-ylz"
          class="bigTable"
        >
          <el-table-column prop="tm" label="时间" align="center">
          </el-table-column>
          <template v-for="(item, index) in reservoirs">
            <el-table-column
              :key="'reservoirs' + index"
              v-if="item.show"
              :prop="item.k"
              :label="item.name + item.unit"
              align="center"
              :render-header="renderheader"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row[item.k] === null ? "-" : scope.row[item.k] }}
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-for="(item, index) in rivers">
            <el-table-column
              :key="'rivers' + index"
              v-if="item.show"
              :prop="item.k"
              :label="item.name + item.unit"
              align="center"
              :render-header="renderheader"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row[item.k] === null ? "-" : scope.row[item.k] }}
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDsmValLine,
  getSYQData,
  getSYQValue,
  getSYQTable,
} from "@/http/api";
import {
  initChartsNormal,
  exportToExcel,
  getGranularity,
} from "@/common/common";
import QueryTime from "@/components/_waterRain/queryTime.vue"; //时间
import pointProjectMixin from "@/mixins/pointProjectMixin";
export default {
  name: "query",
  components: { QueryTime },
  mixins: [pointProjectMixin],
  data() {
    return {
      echartsLoading: false, //echarts加载
      loading: false,
      showMorePicture: false, //是否展示多图单线
      showTable: false, //是否展示数据表
      loadingTable: false, //数据表加载
      tableData: [], //数据表
      form: {
        time: [], //默认值为近三小时
        statisticalMethod: "HOUR",
      }, //时间筛选
      objectForm: {
        reservoir: [], //水库
        riverway: [], //河道
      }, //对象筛选
      reservoirs: [],
      rivers: [],
      rainfall: [],
      key: 0,
      shuikuData: [], //水库过程线
      hedaoData: [], //河道的过程线
      disabledId: null, //禁止用的id
      rainfallData: [], //面雨量柱状图
      charts: [],
      charts2: [],
      shuiku: [], //水库的过程线ptid
      hedao: [], //河道的过程线ptid
      allData: [],
    };
  },
  computed: {
    ...mapGetters({
      sysTheme: "menu/theme",
    }),
  },
  watch: {
    sysTheme() {
      this.onePictureData();
      this.reloadCharts();
      this.getEcharts(this.hedaoData);
      this.getEchart(this.shuikuData);
    },
    showTable() {
      // 显示多图，跳转表格
      if (this.showTable === true && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.table.style.height = "auto";
        this.$refs.table.style.flex = 1;
      }
      // 显示表格，跳转多图
      if (this.showTable === false && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = "auto";
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
      }
      // 显示单图，跳转表格
      if (this.showTable === true && this.showMorePicture === true) {
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.$refs.table.style.height = "auto";
        this.$refs.table.style.flex = 1;
      }
      //显示表格，跳转
      if (this.showTable === false && this.showMorePicture === true) {
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
      }
    },
    showMorePicture() {
      // 显示多图，跳转单图
      if (this.showTable === false && this.showMorePicture === true) {
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
      }
      // 显示多图，跳转单图
      if (this.showTable === false && this.showMorePicture === false) {
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.$refs.chartWrapper.style.height = "auto";
      }
      // 显示表格，跳转单图
      if (this.showTable === true && this.showMorePicture === true) {
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
        this.showTable = false;
      }
      // 显示单图，跳转多图
      if (this.showTable === true && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = "auto";
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.showTable = false;
      }
    },
    allData() {
      if (
        this.objectForm.reservoir.length + this.objectForm.riverway.length ==
        this.allData.length
      ) {
        this.onePictureData();
      }
    },
  },
  created() {
    this.getSelectValue();
  },
  mounted() {},
  methods: {
    // 获取选择详情
    getSelectValue() {
      let that = this;
      this.loading = true;
      getSYQValue().then(function (r) {
        if (r.data.code == 200) {
          let data = r.data.data;
          let shuiku = [];
          let hedao = [];
          let hydrograph = [];
          let hydrograph2 = [];
          data["水库"].forEach((el) => {
            el.name = el.v.split("-")[1];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name != "入库流量" && el.name != "出库流量") {
              shuiku.push(el);
              that.objectForm.reservoir.push(el);
              el.show = true;
              hydrograph.push(el.id);
            }
          });
          that.unique("水库", hydrograph);
          data["河道"].forEach((el) => {
            el.name = el.v.split("-")[0] + el.v.split("-")[1];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name != "黄泥庄河道站流量" && el.name != "坝下河道站流量") {
              hedao.push(el);
              hydrograph2.push(el.id);
              el.show = true;
              that.objectForm.riverway.push(el);
            }
            // if (el.name == "黄泥庄河道站水位") {
            //   that.objectForm.riverway.push(el);
            // }
          });
          // that.unique("河道", hydrograph2);
          // 面雨量不展示
          that.reservoirs = shuiku;
          // that.rivers = hedao;
          that.rivers = [];
          that.loading = false;
        } else {
          that.$message.error(r.data.msg);
        }
      });
    },
    unique(val, arr) {
      var array = [];
      for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
          array.push(arr[i]);
        }
      }
      if (val == "水库") {
        this.shuiku = array;
      } else if (val == "河道") {
        this.hedao = array;
      }
      this.getHydrograph();
    },
    getHydrograph() {
      this.echartsLoading = true;
      if (this.shuiku.length > 0) {
        this.shuiku.forEach((el) => {
          this.getHydrographData("水库", el);
        });
      }
      if (this.hedao.length > 0) {
        this.hedao.forEach((el) => {
          this.getHydrographData("河道", el);
        });
      }
    },
    getHydrographData(val, id) {
      let that = this;

      // 测点检测值;
      let params = {
        ptid: id,
        stime: that.form.time[0],
        etime: that.form.time[1],
      };
      getDsmValLine(params).then(function (r) {
        let data = [];

        if (r.data.code == 200) {
          data = r.data.data;
          if (val == "水库") {
            data.forEach((item) => {
              item.show = true;
              if (item.valName == "库水位") {
                item.valName = "上游水位";
              } else if (item.valName == "坝下水位") {
                item.valName = "下游水位";
              }
              item.id = item.valName;
              item.show = false;
              that.objectForm.reservoir.forEach((el) => {
                if (el.name == item.valName) {
                  item.show = el.show;
                }
              });
            });
            that.shuikuData = data;
            that.getEchart(data);
            // that.$nextTick((_) => {
            //   data.forEach((v, i) => {
            //     let chart = that.$refs.chart[i];
            //     that.charts.push(that.$echarts.init(chart));
            //     let granularity = getGranularity(v.timeValList);
            //     initChartsNormal(that, chart, v, granularity);
            //   });
            // }, 20);
          } else if (val == "河道") {
            data.forEach((item, index) => {
              item.show = true;
              item.id = item.ptnm;
              item.valName = item.ptnm;
              // if (item.valName === "坝下河道站") {
              //   item.show = false;
              // }
              item.show = false;
              that.objectForm.riverway.forEach((el) => {
                if (el.name.split("水位")[0] == item.valName) {
                  item.show = el.show;
                }
              });
            });
            that.hedaoData = that.hedaoData.concat(data);
            that.getEcharts(data);
            // that.$nextTick((_) => {
            //   that.hedaoData.forEach((v, i) => {
            //     let chart = that.$refs.charts[i];
            //     that.charts2.push(that.$echarts.init(chart));
            //     let granularity = getGranularity(v.timeValList);
            //     initChartsNormal(that, chart, v, granularity);
            //   });
            // }, 20);
          }
          that.allData = that.shuikuData.concat(that.hedaoData);
          that.echartsLoading = false;
        }
      });
    },
    getEchart(data) {
      this.$nextTick((_) => {
        data.forEach((v, i) => {
          let chart = this.$refs.chart[i];
          this.charts.push(this.$echarts.init(chart));
          let granularity = getGranularity(v.timeValList);
          initChartsNormal(this, chart, v, granularity);
        });
      }, 20);
    },
    getEcharts(data) {
      this.$nextTick((_) => {
        this.hedaoData.forEach((v, i) => {
          let chart = this.$refs.charts[i];
          this.charts2.push(this.$echarts.init(chart));
          let granularity = getGranularity(v.timeValList);
          initChartsNormal(this, chart, v, granularity);
        });
      }, 20);
    },
    changeValue(val, flag) {
      if (val.time === null) {
        this.$message.info("请先选择起止时间");
      } else {
        let that = this;
        that.form = val;
        // 表格
        that.getTableData();
        if (flag === true) {
          that.getHydrograph();
        }
        that.hedaoData = [];
        that.shuikuData = [];
      }
    },
    getTableData() {
      let data = [];
      var that = this;
      that.loadingTable = true;
      getSYQData({
        endTime: that.form.time[1],
        startTime: that.form.time[0],
        timeTypeEnum: that.form.statisticalMethod,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.tableData = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
          that.loadingTable = false;
        })
        .catch(function (err) {
          that.$message.error(err.response.data.msg);
          that.loadingTable = false;
        });
      getSYQTable({
        endTime: that.form.time[1],
        startTime: that.form.time[0],
        timeTypeEnum: that.form.statisticalMethod,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            data = r.data.data;
            that.tableData = that.tableData.concat(data);
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch(function (err) {
          that.$message.error(err.response.data.msg);
        });
    },
    getRainsData(val, i, e) {
      this.rivers[i].show = e;
      if (this.hedaoData.length > 0) {
        this.hedaoData.forEach((el, index) => {
          if (el.valName == val.name.split("水位")[0]) {
            el.show = val.show;
          }
        });
      }
      if (this.showMorePicture) {
        this.$nextTick(() => {
          this.onePictureData();
        });
      }
    },
    getReservoirData(val, i, e) {
      this.reservoirs[i].show = e;
      if (this.shuikuData.length > 0) {
        this.shuikuData.forEach((el, index) => {
          if (el.valName == val.name) {
            el.show = val.show;
          }
        });
      }
      if (this.showMorePicture) {
        this.$nextTick(() => {
          this.onePictureData();
        });
      }
    },
    exportExcel() {
      exportToExcel("水雨情", "out-table-ylz");
    },
    changeShowTable() {
      // this.$router.push("/waterRain/dataQuery/query");
      let that = this;
      this.loadingTable = true;
      setTimeout(() => {
        that.showTable = !that.showTable;
        that.loadingTable = false;
      }, 500);
    },
    // 单图多线
    onePictureData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.onePicture, "light");
      var colors = ["#5470C6", "#91CC75", "#EE6666"];
      var series = [];
      this.allData.forEach((el) => {
        if (el.show === true) {
          el.timeValList.reverse()
          series.push({
            name: el.valName,
            type: "line",
            data: el.timeValList.map((item) => {
              return [item.tm, item.val];
            }),
            markPoint: {
              symbol: "circle",
              symbolSize: 0,
              symbolOffset: [0, 0],
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
            id: el.valName + el.valunit,
            // yAxisIndex:
            //   el.valName.indexOf("水位") != -1
            //     ? 0
            //     : el.valName.indexOf("蓄水量") != -1
            //     ? 1
            //     : 2,
            yAxisIndex: el.valName.indexOf("水位") != -1 ? 0 : 1,
          });
        }
      });
      myChart.clear(series);
      var option = {
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            // type: "cross",
          },
          // backgroundColor: this.sysTheme == "light" ? "#333" : "#fff",
          formatter: function (params) {
            let str = params[0].axisValue + "<br>";
            let htmlStr = "";
            params.forEach((el, i) => {
              htmlStr =
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                el.color +
                ';"></span>';
              str +=
                htmlStr +
                el.seriesName +
                " : " +
                el.data[1] +
                el.seriesId.split(el.seriesName)[1] +
                "<br>";
            });
            return str;
          },
        },
        grid: [
          {
            top: 80,
            left: 80,
            right: 80,
            bottom: 50,
          },
        ],
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: "过程线分析",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        legend: {
          data: this.allData.map((item) => {
            return item.valName;
          }),
          textStyle: {
            color: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            data: this.allData[0].timeValList.map((item) => {
              return [item.tm];
            }),
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "水位(m)",
            position: "left",
            axisLine: {
              show: true,
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          {
            type: "value",
            name: "蓄水量(亿m³)",
            position: "right",
            // offset: -100,
            axisLine: {
              show: true,
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          // {
          //   type: "value",
          //   name: "流量(m³/s)",
          //   position: "right",
          //   axisLine: {
          //     show: true,
          //     lineStyle: {
          //       color: colors[2],
          //     },
          //   },
          // },
        ],
        series: series,
      };
      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
    changeEcharts() {
      let that = this;
      this.echartsLoading = true;
      setTimeout(() => {
        that.echartsLoading = false;
        that.showMorePicture = !that.showMorePicture;
      }, 500);
    },
    renderheader(h, { column }) {
      return h("span", {}, [
        h("span", {}, column.label.split("(")[0]),
        h("br"),
        h("span", {}, "(" + column.label.split("(")[1]),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.query {
  // @include styles("background-color", "blockBg");
  box-sizing: border-box;
  height: 100%;
  .formButton {
    float: right;
  }
  .timeQuery {
    @include styles("background-color", "blockBg");
    padding: 18px 20px 0;
    box-sizing: border-box;
  }
  .query_content {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    overflow: auto;
    margin-top: 15px;
    .el-form {
      width: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      @include styles("background-color", "blockBg");
      margin-bottom: 15px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100% - 65px) !important;
  }
  .echartsBox {
    overflow: auto;
    .rainfallHistogram {
      height: 300px;
    }
    .lineChart {
      display: flex;
      @include styles("background-color", "blockBg");
      box-sizing: border-box;
      margin-bottom: 15px;
      .charts {
        width: calc(100% - 350px);
        padding: 30px 20px;
        height: 300px;
      }
    }
    .charts {
      height: 350px;
    }
    .chartsInfo {
      width: 350px;
      height: 350px;
      @include styles("background-color", "blockBg");
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .info {
        display: flex;
        @include styles("color", "listTitle");
        .infoTitle {
          width: 80px;
          text-align-last: justify;
        }
      }
    }
  }
  .singlePicture {
    width: 100%;
    height: 0;
    overflow: auto;
    @include styles("background-color", "blockBg");
    .onePicture {
      height: 700px;
      width: calc(100% - 40px);
      margin: 30px 20px;
    }
  }
  .noData {
    text-align: center;
    @include styles("color", "lightTextColor");
    margin-top: 50px;
    font-size: 15px;
  }
  .tableData {
    @include styles("background-color", "blockBg");
    height: 0;
    // flex: 1;
    overflow: auto;
    .el-table {
      width: calc(100% - 40px);
      height: calc(100% - 40px);
      margin: 20px auto;
    }
  }
}
</style>
<style>
.el-picker-panel .el-picker-panel__sidebar {
  height: calc(100% - 40px);
}
.reservoirWaterLevel {
  width: 100%;
  height: 400px;
  float: left;
}
</style>