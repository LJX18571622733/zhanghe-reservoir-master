<template>
  <!-- 测站分布图 -->
  <div class="query flex-col-layout" v-loading="loading" ref="query">
    <el-form
      :model="form"
      class="form-style1 mt-10 timeQuery"
      size="small"
      :inline="true"
    >
      <query-time @changeValue="changeValue"></query-time>
      <el-form-item class="formButton">
        <el-button type="primary" size="small" @click="changeShowTable">{{
          showTable ? "过程线" : "数据表"
        }}</el-button>
        <el-button type="primary" size="small" @click="exportExcel"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <div class="query_content" v-loading="echartsLoading">
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
        <el-form-item label="河道：">
          <el-checkbox-group v-model="objectForm.riverway">
            <el-checkbox
              v-for="(item, index) in rivers"
              :key="'2' + index"
              :label="item"
              @change="getRainsData(item, index, $event)"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="降雨：">
          <el-checkbox-group v-model="objectForm.rainfall">
            <el-checkbox
              v-for="(item, index) in rainfall"
              :key="'3' + index"
              :label="item"
              @change="getRainFallData(item, index, $event)"
              :disabled="disabledId == item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div v-show="!showTable" class="echartsBox" v-loading="loadingTable">
        <!-- 面雨量组合柱状图 -->
        <areal-rainfall
          ref="arealRainfall"
          :rainfall="rainfall"
          :showTable="showTable"
        ></areal-rainfall>

        <!-- 柱状图 -->
        <div
          class="rainfallHistogram"
          v-for="item in rainfallData"
          :key="item.id"
        >
          <rainfall-histogram
            :item="item"
            :showTable="showTable"
          ></rainfall-histogram>
        </div>

        <!-- 水库变化过程线 -->
        <div v-for="item in shuikuData" :key="item.id" class="lineChart">
          <div class="charts" ref="chart" v-show="item.show"></div>
        </div>

        <!-- 河道变化过程线 -->
        <div v-for="item in hedaoData" :key="item.id" class="lineChart">
          <div class="charts" ref="charts" v-show="item.show"></div>
        </div>
      </div>

      <div v-show="showTable" class="tableData" v-loading="loadingTable">
        <el-table
          :data="tableData"
          style="width: 100%; height: 100%"
          border
          size="small"
          v-loading="tableLoading"
          height="100%"
          id="out-table-ylz"
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
          <template v-for="(item, index) in rainfall">
            <el-table-column
              :key="index"
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
import {
  getDsmValLine,
  getSYQData,
  getSYQValue,
  getSYQTable,
  getRainfall,
} from "@/http/api";
import {
  initChartsNormal,
  exportToExcel,
  getGranularity,
} from "@/common/common";
import ArealRainfall from "@/components/_waterRain/arealRainfallHistogram.vue"; //组合柱状图
import QueryTime from "@/components/_waterRain/queryTime.vue"; //时间
import RainfallHistogram from "@/components/_waterRain/rainfallHistogram.vue"; //降雨柱状图
import TimeLine from "@/components/BigData/charts/default/timeLine.vue"; //折线图
export default {
  name: "query",
  props: ["dataurl", "pointid", "com", "index"],
  components: { ArealRainfall, QueryTime, RainfallHistogram, TimeLine },
  data() {
    return {
      echartsLoading: false, //echarts加载
      tableLoading: false, //表格加载
      loadingTable: false, //切换过程线和数据表
      loading: false,
      form: {
        time: [], //默认值为近三小时
        statisticalMethod: "HOUR",
      }, //时间筛选
      showTable: false, //false标识展示echaerts，true标识展示table表格
      objectForm: {
        reservoir: [], //水库
        riverway: [], //河道
        rainfall: [], //降雨
      }, //对象筛选
      reservoirs: [],
      rivers: [],
      rainfall: [],
      key: 0,
      tableData: [],
      shuikuData: [], //水库过程线
      hedaoData: [], //河道的过程线
      disabledId: null, //禁止用的id
      rainfallData: [], //面雨量柱状图
      charts: [],
      charts2: [],
      shuiku: [], //水库的过程线ptid
      hedao: [], //河道的过程线ptid
    };
  },
  created() {
    this.getSelectValue();
  },
  mounted() {},
  methods: {
    // 获取选择详情
    getSelectValue() {
      let that = this;
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
              that.objectForm.riverway.push(el);
            }
            // if (el.name == "黄泥庄河道站水位") {
            //   that.objectForm.riverway.push(el);
            // }
          });
          that.unique("河道", hydrograph2);
          data["雨量"].forEach((el) => {
            el.name = el.v.split("-")[0].split("站")[0];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name == "面雨量") {
              that.disabledId = el.id;
              el.show = true;
            }
            if (
              el.name == "面雨量" ||
              el.name == "梅山雨量" ||
              el.name == "皮坊雨量" ||
              el.name == "金寨雨量" ||
              el.name == "七邻雨量" ||
              el.name == "卷棚桥雨量"
            ) {
              that.objectForm.rainfall.push(el);
              el.show = true;
            }
          });
          that.getRainfallEcharts();
          // 面雨量不展示
          that.reservoirs = shuiku;
          that.rivers = hedao;
          that.rainfall = data["雨量"];
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
            });
            that.shuikuData = data;
            that.$nextTick((_) => {
              data.forEach((v, i) => {
                let chart = that.$refs.chart[i];
                that.charts.push(that.$echarts.init(chart));
                let granularity = getGranularity(v.timeValList);
                initChartsNormal(that, chart, v, granularity);
              });
            }, 20);
          } else if (val == "河道") {
            data.forEach((item, index) => {
              item.show = true;
              item.id = item.ptnm;
              item.valName = item.ptnm;
              // if (item.valName === "坝下河道站") {
              //   item.show = false;
              // }
            });
            that.hedaoData = that.hedaoData.concat(data);
            that.$nextTick((_) => {
              that.hedaoData.forEach((v, i) => {
                let chart = that.$refs.charts[i];
                that.charts2.push(that.$echarts.init(chart));
                let granularity = getGranularity(v.timeValList);
                initChartsNormal(that, chart, v, granularity);
              });
            }, 20);
          }
        }
      });
    },
    changeValue(val, flag) {
      if (val.time === null) {
        this.$message.info("请先选择起止时间");
      } else {
        let that = this;
        that.form = val;
        // 表格
        that.getTableData();
        that.getRainfallEcharts();
        if (flag === true) {
          that.getHydrograph();
        }
        // 面雨量柱状图
        that.$refs.arealRainfall.getArealRainfallData(that.form);
      }
    },
    getRainfallEcharts() {
      let that = this;
      if (that.objectForm.rainfall.length > 1) {
        that.objectForm.rainfall.forEach((el) => {
          if (el.name !== "面雨量") {
            that.rainfallData = [];
            that.getRainfallChart(el.id, el.name);
          }
        });
      }
    },
    getTableData() {
      let data = [];
      var that = this;
      that.tableLoading = true;
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
          that.tableLoading = false;
        })
        .catch(function (err) {
          that.$message.error(err.response.data.msg);
          that.tableLoading = false;
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
    // 获取降雨量
    getRainfallChart(val, name) {
      let that = this;
      that.echartsLoading = true;

      getRainfall(val, {
        timeTypeEnum: that.form.statisticalMethod,
        startTime: that.form.time[0],
        endTime: that.form.time[1],
      }).then(function (r) {
        let data = {};
        if (r.data.code == 200) {
          data = r.data.data;
          data.name = name;
          data.id = val;
          that.rainfallData.push(data);
        } else {
          that.$message.info(r.data.msg);
        }
        that.echartsLoading = false;
      });
    },
    // 删除降雨量
    deleteRainfallChart(id) {
      let that = this;
      let a = that.rainfallData.filter((item) => {
        return item.id != id;
      });
      that.rainfallData = a;
    },
    renderheader(h, { column, $index }) {
      return h("span", {}, [
        h("span", {}, column.label.split("(")[0]),
        h("br"),
        h("span", {}, "(" + column.label.split("(")[1]),
      ]);
    },
    getRainFallData(val, i, e) {
      // 点击展示雨量
      if (e === true) {
        this.getRainfallChart(val.id, val.name);
      } else {
        this.deleteRainfallChart(val.id);
      }
      this.rainfall[i].show = e;
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
    },
    exportExcel() {
      exportToExcel("水雨情", "out-table-ylz");
    },
    changeShowTable() {
      let that = this;
      this.loadingTable = true;

      setTimeout(() => {
        that.showTable = !this.showTable;
        that.loadingTable = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.query {
  @include styles("background-color", "blockBg");
  padding: 10px 0;
  box-sizing: border-box;
  height: 100%;
  .formButton {
    float: right;
  }
  .timeQuery {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .query_content {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #797979;
    width: 100%;
    padding: 20px 40px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    .el-form {
      margin-bottom: 15px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  /deep/ .el-table thead tr {
    background-color: #3392ff;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100% - 65px) !important;
  }
  .echartsBox {
    flex: 1;
    overflow: auto;
    .rainfallHistogram {
      height: 300px;
    }
    .lineChart > div {
      height: 300px;
      margin-bottom: 30px;
    }
    .charts {
      height: 300px;
      margin-bottom: 30px;
    }
  }
  .tableData {
    flex: 1;
    overflow: auto;
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