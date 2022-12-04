<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-row>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline formModel"
      >
        <el-form-item label="测点选择">
          <el-select
            v-model="ptid"
            filterable
            placeholder="请选择"
            @change="changePoint"
          >
            <el-option
              v-for="item in dict"
              :key="item.value"
              :label="item.label"
              :value="String(item.value)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间:" class="tt">
          <el-date-picker
            v-if="value == '时' || value == '3时' || value == '6时'"
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
              value == '周' || value == '旬' || value == '月' || value == '日'
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
            v-if="value == '季' || value == '年'"
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
                    <el-select v-model="valueStep" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in options[value]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
        <!-- <el-form-item label="步长单位"> -->
        <el-form-item label="按">
          <el-select
            v-model="value"
            filterable
            placeholder="请选择"
            @change="stepChange"
            class="tt"
          >
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData()">查询</el-button>
          <el-button type="primary" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24" class="tableFormR">
        <el-table
          :data="tableData"
          height="619"
          id="out-table-pointEigen"
          :span-method="objectSpanMethod"
          style="
            width: 100%;
            overflow: auto;
            background: rgba(40, 73, 133, 0.8);
          "
        >
          <el-table-column
            prop="tm"
            align="center"
            sortable
            :formatter="timeFormat"
            width="160"
            label="日期"
          >
          </el-table-column>
          <el-table-column prop="ptnm" align="center" label="测值类型">
          </el-table-column>
          <el-table-column prop="in" align="center" label="最大值">
            <el-table-column prop="maxVal" align="center" label="测值">
            </el-table-column>
            <el-table-column width="160" align="center" sortable label="时间">
              <template slot-scope="scope">
                {{ getTimeType(scope.row.maxTm) }}
                <!-- {{ scope.row.maxTm | formatTime(value) }} -->
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="out" align="center" label="最小值">
            <el-table-column prop="minVal" align="center" label="测值">
            </el-table-column>
            <el-table-column width="160" align="center" label="时间">
              <template slot-scope="scope">
                <!-- {{ scope.row.minTm | formatTime(value) }} -->
                {{ getTimeType(scope.row.minTm) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column width="100" align="center" label="平均值">
            <template slot-scope="scope">
              {{ scope.row.avgval | numtoFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column width="100" align="center" label="标准差">
            <template slot-scope="scope">
              {{ scope.row.sigma | numtoFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column width="100" align="center" label="方差">
            <template slot-scope="scope">
              {{ scope.row.cov | numtoFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { hours, days, optionDayTime } from "@/config/config";
import {
  dataTimeFormat,
  dataTimeFormatOneYear,
  dataTimeFormatYear,
  dataTimeFormatFirst,
  timeFormatToWay,
} from "@/common/common";
import { montp } from "@/common/index";
import { getNewChaval, getAllTree } from "@/http/api";
import { exportToExcel } from "../../common/common";

export default {
  props: ["dataList", "color", "com", "index", "pointid", "name"],
  data() {
    return {
      num: 1,
      options1: optionDayTime,
      options: {
        时: hours,
        日: days,
        月: [{ label: 1, value: 1 }],
        旬: [{ label: 1, value: 1 }],
        季: [{ label: 1, value: 1 }],
        年: [{ label: 1, value: 1 }],
      },
      valueStep: "1",
      value: "日",
      tableData: [],
      form: {},
      value1: "",
      formInline: {},
      dict: [],
      ptid: "",
      loading: false,
    };
  },
  mounted() {
    if (this.com == this.index) {
      this.getNowTime();
      //this.getDict()
    }
  },
  methods: {
    timeFormat(row, column) {
      let tm = timeFormatToWay(row.tm, this.value);
      return tm;
    },
    getNowTime() {
      let nowTime = dataTimeFormatOneYear();
      this.value1 = [nowTime.old, nowTime.now];
      this.stepChange();
    },
    stepChange() {
      let val = this.value;
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
    getDict() {
      let that = this;
      let river = this.$store.state.river["allList"];
      this.dict = [];
      for (let m in montp[that.name]) {
        for (let key in river) {
          if (river[key].mtpcd == montp[that.name][m]) {
            this.dict.push({ label: river[key].mtnm, value: river[key].mtcd });
          }
        }
      }
      this.ptid =
        this.pointid && this.pointid != 0 ? this.pointid : this.dict[0].value;
      this.getData();
    },
    changePoint(val) {
      this.ptid = val;
      this.getData();
    },
    getData() {
      this.loading = false;
      let that = this;

      let dataF = {
        ptid: this.ptid,
        stime: this.value1[0],
        etime: this.value1[1],
        step: this.valueStep,
        stepUnit: this.value,
      };

      getNewChaval(dataF).then(function (r) {
        that.loading = true;
        that.tableData = [];
        that.tableData = r.data.data;
        /* for (let key in arr) {
                         that.tableData.push(arr[key])
                         /!*for (let m in arr[key]) {
                             that.tableData.push(arr[key][m])
                         }*!/
                     }
                     for (let i = 0, len = that.tableData.length; i < len; i++) {
                         that.tableData[i].time = r.data.data.stime + ' -- ' + r.data.data.etime
                     }*/
      });
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      /*if (columnIndex === 0) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }*/
    },
    exportData() {
      exportToExcel("特征值数据表", "out-table-pointEigen");
    },
    getTimeType(val) {
      if (val !== "" && val !== undefined && val !== null) {
        if (this.value == "日") {
          return val.split(" ")[1];
        } else {
          return val;
        }
      } else {
        return "";
      }
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.getNowTime();
        this.getDict();
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  .formModel {
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

    /deep/ .el-input--suffix {
      width: 100px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 360px;
    }

    /deep/ .el-input__inner {
      color: #fff;
    }

    /deep/ .el-range-input {
      color: #fff;
    }
  }

  /deep/ .el-col {
    color: #fff;

    .text-title {
      text-align: center;

      .titlep {
        font-size: 20px;
        font-weight: 800;
        color: #00f8fe;
        margin: 10px;

        .titles {
          font-size: 14px;
          font-weight: normal;
        }
      }

      .title-bottom {
        float: left;
        margin: 5px;
      }
    }

    .text-row {
      //border: 1px solid #ccc;
      margin: 0px 5px 5px 5px;
      background: rgba(40, 73, 133, 0.8);

      .img-text {
        width: 88px;
        height: 55px;
        margin: 0 5px;
        display: block;
        float: left;
        background: url("../../assets/images/icon003.jpg") no-repeat;

        p {
          color: #00f8fe;
          margin-top: 5px;
        }

        span {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }

  height: 100%;
  width: 100%;
  //background: rgba(40, 73, 133, 0.8);

  .tableFormR {
    /deep/ .el-table--border td,
    /deep/ .el-table--border th,
    /deep/
      .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border: 1px solid #4077c3;
    }

    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
      border: 1px solid #4077c3;
    }

    .el-table--border,
    .el-table--group {
      border: 1px solid #4077c3;
    }
  }

  /deep/ .el-form-item__label {
    color: #fff;
  }

  /deep/ .el-table th,
  /deep/ .el-table tr {
    color: #fff;
    background: rgba(40, 73, 133, 0.8);
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(40, 73, 133, 0.8);
  }

  .borderBox {
    border-right: 1px solid;
    border-image: -webkit-linear-gradient(transparent, #2071a9, transparent) 1
      10 1;
    border-image: -moz-linear-gradient(transparent, #2071a9, transparent) 1 10 1;
    border-image: linear-gradient(transparent, #2071a9, transparent) 1 10 1;
  }

  .charts {
    width: 100%;
    height: 150px;
  }
}
</style>
