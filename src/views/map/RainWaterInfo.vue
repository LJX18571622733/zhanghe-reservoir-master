<template>
  <!-- 测值过程线 -->
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-row style="margin: 10px 0 0 10px">
      <el-form
        :inline="true"
        class="form-style2"
        :model="formModel"
        ref="formModel"
      >
        <!-- <el-form-item label="起止时间:" class="tt" prop="value2">
                    <el-date-picker
                        v-model="formModel.value2"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item> -->
        <el-form-item label="开始时间:" prop="stime">
          <el-date-picker
            v-model="formModel.stime"
            align="right"
            type="date"
            placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 160px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间:" prop="etime">
          <el-date-picker
            v-model="formModel.etime"
            align="right"
            type="date"
            placeholder="选择结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 160px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="统计粒度:" prop="stepUnit" v-if="isShowStepUnit">
          <el-select
            v-model="formModel.stepUnit"
            filterable
            style="width: 100px"
            placeholder="请选择"
            class="tt rr"
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
        <!-- <el-form-item label="起止时间:" class="tt">
                    <el-date-picker
                        v-model="value1"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                            v-if="valueDay == '时' || valueDay == '日' || valueDay == '3时' || valueDay == '6时'  || valueDay == '12时'"
                            v-model="value1"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                            v-if="valueDay == '周' || valueDay == '旬' || valueDay == '月'"
                            v-model="value1"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
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
                            value-format="yyyy-MM"
                            range-separator="至"
                            start-placeholder="开始年份"
                            end-placeholder="结束年份"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="统计粒度:">
                    <el-select v-model="valueDay" filterable placeholder="请选择" class="tt rr" @change="stepChange">
                        <el-option
                                v-for="item in optionDay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计方法:">
                    <el-select v-model="valueWay" filterable placeholder="请选择" class="tt rr">
                        <el-option
                                v-for="item in optionWay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计规则:">
                    <el-select v-model="valueG" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionG"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
        <!-- <el-form-item
          label="监测值:"
          v-if="(name == '变形' || name == '水平位移') && showJc"
        > -->
        <el-form-item
          label="监测值:"
          v-if="
            (name == '变形' ||
              name == '水平位移' ||
              name == '裂坝分析' ||
              name == '钢筋压力计' ||
              name == '渗流量' ||
              name == '渗透压力') &&
            showJc
          "
        >
          <!-- <el-form-item
          label="监测值:"
          v-if="
            valueData.length >= 2 &&
            showJc
          "
        > -->
          <el-select v-model="value" filterable placeholder="请选择" class="tt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getData('search')">查询</el-button>
          <el-button @click="exportTable">导出</el-button>
          <el-button @click="submitBtn">确认预警</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div ref="charts1" class="charts"></div>
      <div style="width: 30%; height: 400px; float: left">
        <tableChart
          :data="tableChartData"
          :textName="text"
          :height="400"
          :id="id"
        ></tableChart>
      </div>
    </el-row>
    <el-row>
      <el-col :span="24" class="tableFormR">
        <el-table
          border
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
            <el-table-column prop="maxVal" align="center" label="值">
            </el-table-column>
            <el-table-column
              prop="maxTm"
              align="center"
              :formatter="timeFormat"
              width="160"
              label="最近出现时间"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="时段最小值">
            <el-table-column align="center" label="值">
              <template slot-scope="scope">
                {{ scope.row.minVal }}
              </template>
            </el-table-column>
            <el-table-column
              prop="minTm"
              :formatter="timeFormats"
              align="center"
              width="160"
              label="最近出现时间"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" width="120" label="时段平均值">
            <template slot-scope="scope">
              {{ scope.row.avgval | numtoFixed(2) }}
            </template>
          </el-table-column>
          <!--<el-table-column
                            prop="pjMmaxBf"
                            align="center"
                            width="120"
                            label="平均最大变幅">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="历史最大值">
                        <el-table-column
                                prop="maxVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                align="center"
                                width="160"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="历史最小值">
                        <el-table-column
                                prop="minVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                align="center"
                                width="160"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="avgHisVal"
                            align="center"
                            width="120"
                            label="历史平均值">
                    </el-table-column>
                    <el-table-column
                            prop="maxBf"
                            align="center"
                            width="120"
                            label="历史最大变幅">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="最新数据">
                        <el-table-column
                                prop="newVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="newTime"
                                width="160"
                                align="center"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>-->
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  optionG,
  optionWay,
  optionDayTime,
  optionJg,
  optionDayTime3,
} from "@/config/config";
import {
  dataTimeFormat,
  dataTimeFormatOneYear,
  dataTimeFormatYear,
  dataTimeFormatFirst,
  initChartsNormal,
  timeFormatToWay,
  exportToExcel,
  getGranularity,
} from "@/common/common";
import { getPointVal, getDsmValLine, affirmWarning } from "@/http/api";
import tableChart from "@/views/map/tableChart";

export default {
  props: ["dataurl", "pointid", "com", "index", "name", "ptcd"],
  components: { tableChart },
  data() {
    return {
      comData: null,
      value: "X方向水平位移",
      value1: "",
      formModel: {
        // value2: '',
        stime: "",
        etime: "",
        stepUnit: "日",
      },
      options: optionJg,
      optionG: optionG, // 统计规则
      valueG: "水文时间8时",
      optionWay: optionWay, // 统计方法
      valueWay: "期初",
      optionDay: optionDayTime3, //统计粒度
      valueDay: "日",
      tableData: [],
      jcData: [],
      loading: false,
      showJc: true,
      valueData: [], //得到测值过程线的长度
      tableChartData: [],
      text: "",
      id: "cz-water-charts",
      granularity: "", // 统计粒度
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      isShowStepUnit: false,
      // chart: null
    };
  },
  mounted() {
    if (this.com == this.index) {
      // this.getNowTime()
      this.resetForm();
      this.getData();
    }
  },
  methods: {
    exportTable() {
      exportToExcel("测值过程线", "cz-water-charts");
    },
    timeFormat(row, column) {
      // let tm = timeFormatToWay(row.maxTm, this.valueDay)
      let tm = row.maxValTm;
      return tm;
    },
    timeFormats(row, column) {
      // let tm = timeFormatToWay(row.minTm, this.valueDay)
      let tm = row.minValTm;
      return tm;
    },
    getNowTime() {
      let nowTime = dataTimeFormatOneYear();
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
    // 新
    getData(val) {
      let that = this;
      this.loading = false;
      //测点检测值
      let params = {
        ptid: this.pointid,
        stepUnit: this.formModel.stepUnit,
        stime: this.formModel.stime,
        etime: this.formModel.etime,
      };
      getDsmValLine(params).then(function (r) {
        that.loading = true;
        that.tableData = [];
        let chart = that.$refs.charts1;
        that.valueData = r.data.data;
        // that.chart = chart1
        if (r.data.data.length > 0) {
          if (r.data.data.length > 1) {
            that.options = [];

            if (
              r.data.data.filter((obj) => obj.valName === that.value).length ===
              0
            ) {
              that.value = r.data.data[0].valName;
            }
            for (let key in r.data.data) {
              that.options.push({
                label: r.data.data[key].valName,
                value: r.data.data[key].valName,
              });
              if (val !== "search") {
                that.value = r.data.data[0].valName;
              }
              if (that.value == r.data.data[key].valName) {
                that.tableData.push(r.data.data[key]);
                that.tableData[0].name = r.data.data[key].ptcd;
                // 起始时间回显
                let timeValList = r.data.data[key].timeValList;
                if (timeValList.length) {
                  // that.formModel.stime = timeValList[0].tm;
                  // that.formModel.etime = timeValList[timeValList.length - 1].tm;
                  that.formModel.stime = timeValList[timeValList.length - 1].tm;
                  that.formModel.etime = timeValList[0].tm;
                }
                that.tableChartData = timeValList;
                that.text =
                  r.data.data[key].valName +
                  "(" +
                  r.data.data[key].valunit +
                  ")";
                that.granularity = getGranularity(timeValList);
                initChartsNormal(
                  that,
                  chart,
                  r.data.data[key],
                  that.granularity
                );
              }
            }
          } else {
            that.tableData.push(r.data.data[0]);
            that.tableData[0].name = r.data.data[0].ptcd;
            // 起始时间回显
            let timeValList = r.data.data[0].timeValList;
            if (timeValList.length) {
              // that.formModel.stime = timeValList[0].tm;
              // that.formModel.etime = timeValList[timeValList.length - 1].tm;
              that.formModel.stime = timeValList[timeValList.length - 1].tm;
              that.formModel.etime = timeValList[0].tm;
            }
            that.tableChartData = timeValList;
            that.text =
              r.data.data[0].valName + "(" + r.data.data[0].valunit + ")";
            that.granularity = getGranularity(timeValList);
            initChartsNormal(that, chart, r.data.data[0], that.granularity);
          }
        } else {
          let chart1 = that.$echarts.init(chart);
          chart1.clear();
          that.options = optionJg;
          if (val !== "search") {
            that.value = that.options[0].label;
          }
        }
      });
    },
    /*getData() {
                let that = this
                this.loading = false
                let nowTime = dataTimeFormat()
                //测点检测值
                let params = {
                    ptid: this.pointid,
                    stime: that.value1[0],
                    etime: that.value1[1],
                    statMethod: this.valueWay,
                    stepUnit: this.valueDay,
                    statRule: this.valueG
                }
                getPointVal(params).then(function (r) {
                    that.loading = true
                    if (r.data.data.length > 0) {
                        that.jcData = [], that.form = [];
                        that.tableData = []

                        if(r.data.data.length > 1){
                            for (let key in r.data.data) {
                                if (that.value == r.data.data[key].valname) {
                                    that.tableData.push(r.data.data[key])
                                    that.tableData[0].name = r.data.data[key].ptcd;
                                    let chart = that.$refs.charts1;
                                    that.tableChartData = r.data.data[key].timeValList
                                    that.text = r.data.data[key].valname + '(' + r.data.data[key].valunit + ')'
                                    initChartsNormal(that, chart, r.data.data[key], that.valueDay)
                                }
                            }
                        }else {
                            that.showJc = false
                            that.tableData.push(r.data.data[0])
                            that.tableData[0].name = r.data.data[0].ptcd;
                            let chart = that.$refs.charts1;
                            that.tableChartData = r.data.data[0].timeValList
                            that.text = r.data.data[0].valname + '(' + r.data.data[0].valunit + ')'
                            initChartsNormal(that, chart, r.data.data[0], that.valueDay)
                        }


                    }
                });
            },*/
    resetForm() {
      this.$refs.formModel.resetFields();
      if (this.ptcd) {
        let str;
        if (typeof this.ptcd == "string") {
          str = this.ptcd.substr(0, 2);
        } else {
          str = this.ptcd["_value"].substr(0, 2);
        }
        if (str == "WT" || str == "QW") {
          //气温或者水温 可以按小时查询
          this.isShowStepUnit = true;
        } else {
          this.isShowStepUnit = false;
        }
      } else {
        this.isShowStepUnit = false;
      }
    },
    
    submitBtn(val, i) {
      let that = this;
      this.$confirm("此操作将不再提示该条预警信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          affirmWarning({
            ptcd: that.tableData[0].name,
          })
            .then((r) => {
              if (r.data.code == "200") {
                that.$store.state.menu.warningInfo = "update";
                that.$store.state.menu.warningPtcd = that.tableData[0].name;
                that.$message({
                  type: "success",
                  message: "确认成功!",
                });
              } else {
                that.$message(r.data.msg);
              }
            })
            .catch((e) => {
              this.$message(e.data.msg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消确认",
          });
        });
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.showJc = true;
        this.resetForm();
        // this.getNowTime()
        this.getData();
      }
    },
    pointid(newval, oldval) {
      if (newval != oldval) {
        this.loading = false;
        this.showJc = true;
        this.resetForm();
        // this.getNowTime()
        this.getData();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.RainBar {
  color: #fff;
  height: 500px;

  text-align: center;
}

.info {
  width: 100%;
  height: 620px;
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

    /deep/ .rr {
      .el-input--suffix {
        width: 100px;
      }
    }

    /deep/.el-input--suffix {
      width: 120px;
    }

    /deep/ .el-radio-button__inner {
      padding: 12px 5px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 340px;
    }
  }

  .charts {
    width: 70%;
    height: 400px;
    float: left;
  }
}
</style>
