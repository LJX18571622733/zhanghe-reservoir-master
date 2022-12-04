<template>
  <!-- 水雨情 - 降雨过程 -->
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-row>
      <el-form :inline="true" class="demo-form-inline formModel">
        <el-form-item label="起止时间:" class="tt">
          <el-date-picker
            v-if="valueDay == '小时' || valueDay == '3时' || valueDay == '6时'"
            v-model="value1"
            type="datetimerange"
            format="yyyy-MM-dd HH:00"
            value-format="yyyy-MM-dd HH:00"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-date-picker
            v-if="
              valueDay == '日' ||
              valueDay == '周' ||
              valueDay == '旬' ||
              valueDay == '月'
            "
            v-model="value1"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-date-picker
            v-if="valueDay == '季' || valueDay == '年'"
            v-model="value1"
            type="monthrange"
            format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始年份"
            end-placeholder="结束年份"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="步长:">
          <el-select
            v-model="valueStep"
            filterable
            placeholder="请选择"
            class="tt"
          >
            <el-option
              v-for="item in options[valueDay]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="步长单位:"> -->
        <el-form-item label="按:">
          <el-select
            v-model="valueDay"
            filterable
            placeholder="请选择"
            class="tt"
            @change="stepChange"
          >
            <el-option
              v-for="item in optionDay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="统计方法:">
                    <el-select v-model="valueWay" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionWay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
        <el-form-item label="统计规则:" v-if="valueDay != '小时'">
          <el-select
            v-model="valueG"
            filterable
            placeholder="请选择"
            class="tt"
          >
            <el-option
              v-for="item in optionG"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData()">查询</el-button>
          <el-button type="primary" @click="exportTable()">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div ref="charts1" class="charts"></div>
      <div style="width: 30%; height: 450px; float: left">
        <tableChart
          :data="tableChartData"
          :textName="text"
          :height="450"
          :id="id"
        ></tableChart>
      </div>
    </el-row>
    <el-row>
      <el-col :span="24" class="tableFormR">
        <el-table
          :data="tableData"
          height="161"
          style="
            overflow: auto;
            width: 100%;
            background: rgba(40, 73, 133, 0.8);
          "
        >
          <el-table-column prop="name" align="center" label="测点">
          </el-table-column>
          <el-table-column align="center" label="时段最大值">
            <el-table-column prop="maxVal" align="center" label="值(mm)">
            </el-table-column>
            <el-table-column prop="maxTime" align="center" label="出现时间">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="avgVal" align="center" label="时段平均值(mm)">
            <template slot-scope="scope">
              {{ scope.row.avgVal | numtoFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sumVal"
            align="center"
            label="统计区间累计值(mm)"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  optionG,
  optionWayRain,
  optionDays,
  hours,
  days,
} from "@/config/config";
import {
  dataTimeFormat,
  dataTimeFormatOneYear,
  dataTimeFormatYear,
  dataTimeFormatFirst,
  initChartsWay,
  timeFormatToWay,
  exportToExcel,
} from "@/common/common";
import { getPointVal } from "@/http/api";
import tableChart from "@/views/map/tableChart";

export default {
  props: ["dataurl", "pointid", "com", "index"],
  components: { tableChart },
  data() {
    return {
      comData: null,
      value: "",
      value1: "",
      options: {
        小时: hours,
        日: days,
        月: [{ label: 1, value: 1 }],
        旬: [{ label: 1, value: 1 }],
        季: [{ label: 1, value: 1 }],
        年: [{ label: 1, value: 1 }],
      },
      optionG: optionG,
      valueG: "水文时间8时",
      optionWay: optionWayRain,
      valueWay: "累计",
      optionDay: optionDays,
      valueDay: "日",
      ptid: "",
      tableData: [],
      valueStep: "1",
      loading: false,
      tableChartData: [],
      text: "",
      id: "rain-water-charts",
    };
  },
  mounted() {
    if (this.com == this.index) {
      this.getNowTime();
      this.getPtid();
    }
  },
  methods: {
    exportTable() {
      exportToExcel("降雨过程线", "rain-water-charts");
    },
    getNowTime() {
      let nowTime = dataTimeFormat();
      this.value1 = [nowTime.old, nowTime.now];
      this.stepChange();
    },
    stepChange() {
      let val = this.valueDay;
      if (val == "周" || val == "旬" || val == "月") {
        let nowTime = dataTimeFormatOneYear();
        this.value1 = [nowTime.old, nowTime.now];
      } else if (val == "季" || val == "年") {
        let nowTime = dataTimeFormatYear();
        this.value1 = [nowTime.old, nowTime.now];
      } else if (val == "日") {
        let nowTime = dataTimeFormatFirst();
        this.value1 = [nowTime.old, nowTime.now];
      } else {
        let nowTime = dataTimeFormat();
        this.value1 = [nowTime.old, nowTime.now];
      }
    },
    getPtid() {
      let that = this;
      let pp = this.$store.state.river["pp"];

      for (let i = 0, len = pp.length; i < len; i++) {
        if (pp[i].ptid == that.pointid) {
          that.ptid = pp[i].ptcd;
          that.getData();
        }
      }
    },
    getData() {
      this.loading = false;
      //降雨量数据
      let that = this;
      let params = {
        ptid: this.pointid,
        stime: this.value1[0],
        etime: this.value1[1],
        stepUnit: this.valueDay,
        step: this.valueStep,
        statRule: this.valueG,
        statMethod: this.valueWay,
      };
      getPointVal(params).then(function (r) {
        that.loading = true;
        if (r.data.data) {
          that.tableData = [];
          let data = r.data.data[0];
          if (data) {
            let obj = {
              name: that.ptid,
              maxVal: data.maxVal,
              maxTime: timeFormatToWay(data.maxTm, that.valueDay),
              avgVal: data.avgval,
              sumVal: data.sumval,
            };
            that.tableData.push(obj);

            let chart = that.$refs.charts1;

            that.tableChartData = data.timeValList;
            that.text = data.valname + "(" + data.valunit + ")";
            initChartsWay(that, chart, data, that.valueDay, true, false);
          }
        }
      });
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.getNowTime();
        this.getPtid();
      }
    },
    pointid(newval, oldval) {
      if (newval != oldval) {
        this.loading = false;
        this.getNowTime();
        this.getPtid();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.RainBar {
  color: #fff;
  height: 600px;

  text-align: center;
}

.info {
  width: 100%;
  height: 670px;
  background-color: rgba(40, 73, 133, 0.8);

  .formModel {
    color: #fff;

    /deep/ .el-form-item {
      margin: 10px;
    }

    /deep/ .el-input__inner {
      border: 1px solid #00ffff;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .el-date-editor .el-range-separator {
      color: #fff;
    }

    /deep/ .el-range-input {
      background-color: transparent;
    }

    .el-button--primary {
      border: 1px solid #00ffff;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .el-radio-button__inner {
      border: 1px solid #00ffff;
      color: #ccc;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .is-active {
      /deep/ .el-radio-button__inner {
        color: #fff;
        background-color: #49d1ff;
      }
    }

    /deep/ .el-range-input {
      color: #fff;
    }

    /deep/ .el-input--suffix {
      width: 100px;
    }

    /deep/ .el-radio-button__inner {
      padding: 12px 5px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 340px;
    }
  }

  .charts {
    width: 837px;
    height: 450px;
    float: left;
  }
}
</style>
