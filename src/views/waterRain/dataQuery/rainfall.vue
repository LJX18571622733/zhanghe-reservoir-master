<template>
  <!-- 降雨信息 -->
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
          showTable ? "柱状图" : "数据表"
        }}</el-button>
        <el-button type="primary" size="small" @click="exportExcel"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <div class="query_content">
      <el-form :model="objectForm" class="form-style1">
        <el-form-item label="雨量站：">
          <el-checkbox-group v-model="objectForm.rainfall">
            <el-checkbox
              v-for="(item, index) in rainfall"
              :key="'3' + index"
              :label="item"
              @change="getRainFallData(item, index, $event)"
              :disabled="item.disabled === true"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="echartsBox" v-show="!showTable" v-loading="loadingTable">
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
            :rainfallData="rainfall"
          ></rainfall-histogram>
        </div>
      </div>

      <div v-if="showTable" class="tableData" v-loading="loadingTable">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          size="small"
          v-loading="tableLoading"
          height="100%"
          id="out-table-ylz"
          class="bigTable"
        >
          <el-table-column prop="tm" label="时间" align="center">
          </el-table-column>
          <el-table-column
            prop="tm"
            label="坝上水位站(m)"
            align="center"
            :render-header="renderheader"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.rz === null ? "-" : scope.row.rz }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="tm"
            label="坝下水位站(m)"
            align="center"
            :render-header="renderheader"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.blrz === null ? "-" : scope.row.blrz }}
              </div>
            </template>
          </el-table-column>
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
import { getSYQData, getSYQValue, getRainfall, getSYQTable } from "@/http/api";
import ArealRainfall from "@/components/_waterRain/arealRainfallHistogram.vue"; //组合柱状图
import QueryTime from "@/components/_waterRain/queryTime.vue"; //时间
import RainfallHistogram from "@/components/_waterRain/rainfallHistogram.vue"; //降雨柱状图
import { exportToExcel } from "@/common/common";
export default {
  name: "query",
  components: { ArealRainfall, QueryTime, RainfallHistogram },
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 50,
      height: null,
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
      disabledId: null, //禁止用的id
      rainfallData: [],
      loadingTable: false,
      tableLoading: false,
    };
  },
  created() {
    this.getSelectValue();
  },
  mounted() {
    this.height = this.$refs.query.scrollHeight - 260;
  },
  methods: {
    getSelectValue() {
      let that = this;
      let list = ['鸡公尖','烟灯','西河站','薛坪','板桥','高峰','甘溪','肖埝','巡检', '打鼓台','太平']
      getSYQValue().then(function (r) {
        if (r.data.code == 200) {
          let data = r.data.data;
          data["雨量"].forEach((el,i ) => {
            // el.name = el.v.split("-")[0].split("雨量站")[0];
            el.name = list[i];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name == "面雨量" || el.name == "梅山") {
              el.disabled = true;
              el.show = true;
              that.objectForm.rainfall.push(el);
            }
          });
          that.getRainfallEcharts();
          that.rainfall = data["雨量"];
          that.loading = false;
        } else {
          that.$message.error(r.data.msg);
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
        // 面雨量柱状图
        that.$refs.arealRainfall.getArealRainfallData(that.form);
      }
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
    getTableData() {
      let data = [];
      var that = this;
      that.tableLoading = true;
      if (that.form.time[1].length == 13) {
        that.form.time[0] = that.form.time[0] + ":00:00";
        that.form.time[1] = that.form.time[1] + ":00:00";
      }
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
    // 获取降雨量
    getRainfallChart(val, name) {
      let that = this;
      this.loadingTable = true;
      if (that.form.time[1].length == 13) {
        that.form.time[0] = that.form.time[0] + ":00:00";
        that.form.time[1] = that.form.time[1] + ":00:00";
      }

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
        that.loadingTable = false;
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
    changeShowTable() {
      let that = this;
      this.loadingTable = true;

      setTimeout(() => {
        that.showTable = !this.showTable;
        that.loadingTable = false;
      }, 500);
    },
    // 导出数据
    exportExcel() {
      exportToExcel("水雨情", "out-table-ylz");
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
    width: 100%;
    padding: 0 40px 20px;
    box-sizing: border-box;
    // flex: 1;
    overflow-y: auto;
    height: 100%;
    .el-form {
      margin-bottom: 15px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
    /deep/
      .el-checkbox__input.is-disabled.is-checked
      .el-checkbox__inner::after {
      border-color: #fff;
    }
    /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #409eff;
    }
  }
  /deep/ .el-table thead tr {
    background-color: #3392ff;
  }
  .echartsBox {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
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