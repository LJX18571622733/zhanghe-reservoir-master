<!--水情报表-->
<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-row>
      <el-form :inline="true" class="demo-form-inline formModel">
        <el-form-item label="测点选择">
          <el-select
            v-model="ptid"
            filterable
            placeholder="请选择"
            class="tt"
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
              valueDay == '周' ||
              valueDay == '旬' ||
              valueDay == '月' ||
              valueDay == '日'
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
        <el-form-item label="统计粒度:">
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
        <el-form-item label="统计方法:">
          <el-select
            v-model="valueWay"
            filterable
            placeholder="请选择"
            class="tt"
          >
            <el-option
              v-for="item in optionWay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计规则:" v-if="valueDay != '时'">
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
        <el-form-item label="监测值:" v-if="name == '变形' && showJc">
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
          <el-button type="primary" @click="getData()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div ref="charts1" class="charts1" v-show="single === false"></div>
      <div class="charts1 chartsNo" v-show="single === true">该时段样本数量不足</div>
    </el-row>
    <el-row>
      <div ref="charts2" class="charts1"></div>
    </el-row>
    <el-row>
      <div ref="charts3" class="charts1"></div>
    </el-row>
  </div>
</template>

<script>
import { optionDayTime, optionWay, optionG, optionJg } from "@/config/config";
import {
  dataTimeFormat,
  dataTimeFormatOneYear,
  dataTimeFormatYear,
  initChartsRelated,
  initChartsMath,
  dataTimeFormatFirst,
} from "@/common/common";
import {
  getPointVal,
  getInfoByStcd,
  mathSingle,
  getDayPP,
  getDayTm,
  getDayRz,
} from "@/http/api";
import { montp } from "@/common/index";

export default {
  props: ["dataList", "color", "com", "index", "pointid", "name", "type"],
  components: {},
  data() {
    return {
      options: optionJg,
      tableData: [{}],
      value1: "",
      dict: [],
      ptid: "",
      optionDay: optionDayTime,
      valueDay: "日",
      optionWay: optionWay,
      valueWay: "期初",
      optionG: optionG,
      valueG: "水文时间8时",
      ddData: [],
      timeArr: [],
      value: "X方向水平位移",
      single: Boolean,
      loading: false,
      showJc: true,
    };
  },
  mounted() {
    if (this.com == this.index) {
      this.getNowTime();
      this.getDict();
    }
  },
  methods: {
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
      let params = {
        ptid: this.ptid,
        stime: this.value1[0],
        etime: this.value1[1],
        statMethod: this.valueWay,
        stepUnit: this.valueDay,
        statRule: this.valueG,
      };
      //测点检测值
      getPointVal(params).then(function (r) {
        if (r.data.data.length > 0) {
          that.jcData = [];
          if (r.data.data.length > 1) {
            for (let key in r.data.data) {
              if (that.value == r.data.data[key].valname) {
                for (let i = 0; i < r.data.data[key].timeValList.length; i++) {
                  let obj = {
                    val: r.data.data[key].timeValList[i].val,
                    tms: r.data.data[key].timeValList[i].tm,
                  };
                  that.jcData.push(obj);
                }
                let chart = that.$refs.charts2;
                initChartsRelated(that, chart, r.data.data[0], that.valueDay);
              }
            }
          } else {
            that.showJc = false;
            for (let i = 0; i < r.data.data[0].timeValList.length; i++) {
              let obj = {
                val: r.data.data[0].timeValList[i].val,
                tms: r.data.data[0].timeValList[i].tm,
              };
              that.jcData.push(obj);
            }
            let chart = that.$refs.charts2;
            initChartsRelated(that, chart, r.data.data[0], that.valueDay);
          }

          if (that.type == "水位") {
            that.getNextDataS();
          } else if (that.type == "温度") {
            that.getNextDataW();
          } else if (that.type == "降雨") {
            that.getNextDataY();
          }
        }
      });
    },
    getNextDataS() {
      //水位数据
      let that = this;
      let params = {
        ptid: window.cfg["坝上id"],
        stime: this.value1[0],
        etime: this.value1[1],
        statField: "rz",
        statMethod: this.valueWay,
        stepUnit: this.valueDay,
        statRule: this.valueG,
      };
      getPointVal(params).then(function (r) {
        if (r.data.data) {
          that.ddData = [];
          that.timeArr = [];
          r.data.data[0].timeValList.forEach((item) => {
            that.timeArr.push(item.tm);
            that.ddData.push(item.val);
          });
          //that.ddData.reverse()
          //that.timeArr.reverse()

          let chart = that.$refs.charts3;
          initChartsRelated(that, chart, r.data.data[0], that.valueDay);
          that.calcMath();
        }
        that.loading = true;
      });
    },
    getNextDataW() {
      //气温数据
      let that = this;
      let params = {
        ptid: window.cfg["温度id"],
        stime: this.value1[0],
        etime: this.value1[1],
        statMethod: this.valueWay,
        stepUnit: this.valueDay,
        statRule: this.valueG,
      };
      getPointVal(params).then(function (r) {
        if (r.data.data.length > 0) {
          that.ddData = [];
          that.timeArr = [];
          r.data.data[0].timeValList.forEach((item) => {
            that.timeArr.push(item.tm);
            that.ddData.push(item.val);
          });
          //that.ddData.reverse()
          //that.timeArr.reverse()

          let chart = that.$refs.charts3;
          initChartsRelated(that, chart, r.data.data[0], that.valueDay);
          that.calcMath();
        }
        that.loading = true;
      });
    },
    getNextDataY() {
      //降雨量数据
      let that = this;
      let params = {
        ptid: window.cfg["降雨量id"],
        stime: this.value1[0],
        etime: this.value1[1],
        statMethod: this.valueWay,
        stepUnit: this.valueDay,
        statRule: this.valueG,
      };
      getPointVal(params).then(function (r) {
        let data = r.data.data;
        if (data.length > 0) {
          that.ddData = [];
          that.timeArr = [];
          data[0].timeValList.forEach((item) => {
            that.timeArr.push(item.tm);
            that.ddData.push(item.val);
          });
          //that.ddData.reverse()
          //that.timeArr.reverse()

          let chart = that.$refs.charts3;

          initChartsRelated(that, chart, data[0], that.valueDay);
          that.calcMath();
        }
        that.loading = true;
      });
    },
    calcMath() {
      let that = this;
      let arr = [];

      let temp =
        this.ddData.length > that.jcData.length ? that.jcData : this.ddData;

      for (let i = 0, len = temp.length; i < len; i++) {
        arr.push([that.jcData[i].val, that.ddData[i]]);
      }
      let arr1 = that.jcData.map((item) => {
        return item.val;
      });

      let params = {
        x: arr1,
        y: that.ddData,
      };

      mathSingle(params).then(function (r) {
        if (r.data.data == null || r.data.data.r == "NaN") {
          that.single = true;
        } else {
          that.single = false;
          let data = r.data.data;
          let chart = that.$refs.charts1;
          // this.refe.charts1.style.width = '1100px'
          initChartsMath(that, chart, arr, data);
        }
      });
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.showJc = true;
        this.getNowTime();
        this.getDict();
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  height: 100%;
  width: 100%;
  background: rgba(40, 73, 133, 0.8);

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

    /deep/ .el-input--suffix {
      width: 120px;
    }

    /deep/ .el-radio-button__inner {
      padding: 12px 5px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 360px;
    }
  }

  .charts1 {
    width: 1196px;
    height: 200px;
  }

  .chartsNo {
    color: #fff;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
  }
}
</style>
