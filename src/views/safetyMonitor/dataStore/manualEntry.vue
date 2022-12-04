<template>
  <div class="manualEntry" v-loading="loading">
    <el-form label-width="80px" class="form-style1" :inline="true" :model="form" size="small">
      <el-form-item label="监测类型">
        <el-select
          v-model="form.itemIndex"
          placeholder="请选择监测类型"
          @change="changeItme"
        >
          <el-option
            v-for="(item, index) in selectList"
            :key="index"
            :label="item.name"
            :value="index"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测点编号">
        <el-select v-model="form.ptcd" placeholder="请选择测点编号">
          <el-option
            v-for="(i, index) in instrumentList"
            :key="index"
            :label="i.ptcd"
            :value="i.ptcd"
          >
          </el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="form.time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addData">新增</el-button>
      </el-form-item>
    </el-form>

    <div class="manualEntryHistory">
      <el-table
      :data="tableList"
      style="width: 40%"
      height="calc(100% - 60px)"
        :row-class-name="rowClass"
        highlight-current-row
        @row-click="selectChange"
      v-loading="tableLoading">
      <el-table-column
        prop="importDate"
        label="录入时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ptcds"
        align="center"
        label="测点编号">
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        :label="form.r1Name">
        <template slot-scope="scope">
            <div>{{ scope.row.detail[0].r1 }}</div>
          </template>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        v-if="form.mtype == 1"
        :label="form.r2Name">
        <template slot-scope="scope">
            <!-- <div>{{ scope.row.detail[0].r2 }} != '' ? {{ scope.row.detail[0].r2 }}{{scope.row.r2unit}} : ''</div> -->
            <div v-show="scope.row.detail[0].r2 !== '' && scope.row.detail[0].r2 !== undefined">{{ scope.row.detail[0].r2 }}</div>
          </template>
      </el-table-column>
    </el-table>
    <div class="echart" v-loading="echartLoading" v-if="tableList.length > 0">
        <el-form
          :model="echartForm"
          :inline="true"
          class="form-style2"
          size="small"
        >
          <el-form-item label="起止时间">
            <el-date-picker
              v-model="echartForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="getEcharts"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div ref="echart"></div>
      </div>
      <div class="noData" v-if="tableList.length === 0">请选择测点编号</div>
    </div>

    <el-dialog
      title="新增"
      :visible.sync="addShow"
      width="30%"
      center
      :append-to-body="true"
      class="department"
    >
      <el-form
        :model="addForm"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="时间"
          prop="tm"
          :rules="[
            { required: true, message: '请选择时间', trigger: 'change' }
          ]"
        >
      <el-date-picker
          v-model="addForm.tm"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        >
        </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="form.r1Name"
          prop="r1"
          :rules="[{ required: true, message: '请输入' + form.r1Name }]"
        >
          <el-input
            v-model="addForm.r1"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
        v-if="addForm.mtype == 1"
          :label="form.r2Name"
          prop="r2"
          :rules="[{ required: true, message: '请输入' + form.r2Name }]"
        >
          <el-input
            v-model="addForm.r2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="测点编号"
          prop="ptcd"
          :rules="[{ required: true, message: '请选择测点编号' }]"
        >
          <!-- <el-input v-model="addForm.ptcd" disabled></el-input> -->
          <el-select allow-create filterable clearable v-model="addForm.ptcd" placeholder="请选择测点编号">
          <el-option
            v-for="(i, index) in instrumentList"
            :key="index"
            :label="i.ptcd"
            :value="i.ptcd"
          >
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getManualEntryType,
  addManualEntry,
  getManualEntry,
  getEchartsData,
} from "@/http/api";
import fecha from "fecha";
export default {
  data() {
    return {
      loading: false,
      form: {
        itemIndex: null,
        ptcd: "", //测点编号
        time: "",
        mtype: null,
        r1Name: null,
        r2Name: null,
      },
      selectList: [],
      instrumentList: [],
      tableData: [],
      tableList: [],
      tableLoading: false,
      addShow: false,
      addForm: {
        tm: "",
        r1: "",
        r2: "",
        ptcd: "",
        mtype: "",
      },
      echartForm: {
        date: [],
      },
      echartsList: {},
      echartData: {
        ptcd: "",
        stime: "",
        etime: "",
        mtype: "",
      },
      echartLoading: false,
    };
  },
  watch: {
    sysTheme() {
      this.getEchart();
    },
  },
  mounted() {
    let current = new Date();
    let start = new Date();
    start.setTime(new Date(start.getFullYear() - 1, 6, 1));
    current.setTime(current.getTime() - 3600 * 1000 * 24);
    this.echartForm.date = [
      fecha.format(start, "YYYY-MM-DD"),
      fecha.format(current, "YYYY-MM-DD"),
    ];
    this.form.time = fecha.format(new Date(), "YYYY-MM-DD HH:mm:ss");
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      // let test = [
      //   {
      //     mType: 1,
      //     name: "表面水平位移",
      //     points: [],
      //     r1Name: "X方向水平位移(mm)",
      //     url: "/upload/model/表面水平位移.xls",
      //   },
      // ];
      getManualEntryType()
        .then(function (r) {
          if (r.data.code == "200") {
            that.selectList = r.data.data;
            // that.selectList = test;
            if (that.selectList.length > 0) {
              that.form.itemIndex = 0;
              if (that.selectList[that.form.itemIndex].points.length > 0) {
                that.instrumentList =
                  that.selectList[that.form.itemIndex].points;
                that.form.ptcd =
                  that.selectList[that.form.itemIndex].points[0].ptcd;
                that.form.mtype = that.selectList[that.form.itemIndex].mType;
                that.form.r1Name = that.selectList[that.form.itemIndex].r1Name;
                that.form.r2Name =
                  that.selectList[that.form.itemIndex].r2Name || "";
              }
              that.getTable();
              that.loading = false;
            } else {
              that.form.itemIndex = null;
            }
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getTable() {
      let that = this;
      this.tableLoading = true;
      getManualEntry({
        recordType: 1,
      })
        .then(function (r) {
          if (r.data.code == "200") {
            that.tableData = r.data.data;
          } else {
            that.tableData = [];
          }
          that.tableLoading = false;
          that.changeItme();
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getEcharts() {
      let that = this;
      this.echartLoading = true;
      getEchartsData({
        stime: that.echartForm.date[0],
        etime: that.echartForm.date[1],
        ptcd: that.echartData.ptcd,
        mtype: that.echartData.mtype,
      })
        .then(function (r) {
          if (r.data.code == "200") {
            if (r.data.data.length > 0) {
              that.echartsList = r.data.data[0];
            } else {
              that.echartsList = {};
              that.echartsList.timeValList = [];
              that.echartsList.valName = "";
            }
            that.getEchart();
            that.echartLoading = false;
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getEchart() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(that.$refs.echart, "light");
      myChart.clear();
      var option = {
        tooltip: {
          trigger: "axis",
          formatter: "{b}：<br/> {c}" + this.echartsList.valunit,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: this.echartsList.valName,
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
            data: this.echartsList.timeValList.map((item) => {
              return [item.tm];
            }),
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
            name: this.echartsList.valName
              ? this.echartsList.valName + "(" + this.echartsList.valunit + ")"
              : "",
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
        series: {
          type: "line",
          data: this.echartsList.timeValList.map((item) => {
            return item.val;
          }),
        },
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
    // 切换监测项目
    changeItme() {
      this.tableLoading = true;
      let list = [];
      if (this.form.itemIndex !== null) {
        this.instrumentList = this.selectList[this.form.itemIndex].points;
        if (this.selectList[this.form.itemIndex].points.length > 0) {
          this.form.ptcd = this.selectList[this.form.itemIndex].points[0].ptcd;
        }
        this.form.mtype = this.selectList[this.form.itemIndex].mType;
        this.form.r1Name = this.selectList[this.form.itemIndex].r1Name;
        this.form.r2Name = this.selectList[this.form.itemIndex].r2Name || "";
        this.tableData.forEach((el) => {
          if (el.mtype === this.selectList[this.form.itemIndex].mType) {
            list.push(el);
          }
        });
        this.tableLoading = false;
        this.tableList = list;
        if (list.length > 0) {
          this.tableIndex = 0;
          this.echartData.ptcd = list[0].ptcds;
          this.echartData.stime = list[0].stime;
          this.echartData.etime = list[0].etime;
          this.echartData.mtype = list[0].mtype;
          this.getEcharts();
        } else {
          this.tableIndex = null;
          this.echartData.ptcd = "";
          this.echartData.stime = "";
          this.echartData.etime = "";
          this.echartData.mtype = "";
          this.echartsList = {};
          this.echartsList.timeValList = [];
          this.echartsList.valName = "";
        }
      }
    },
    addData() {
      this.addShow = true;
      this.addForm.tm = this.form.time;
      this.addForm.ptcd = this.form.ptcd;
      this.addForm.mtype = this.selectList[this.form.itemIndex].mType;
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addManualEntry(this.addForm)
            .then(function (r) {
              if (r.data.code == "200") {
                that.$message.success("新增成功");
                that.addShow = false;
                that.getTable();
              } else {
                that.form.itemIndex = null;
              }
            })
            .catch((err) => {
              that.$message.error("请联系管理人员");
            });
        } else {
          return false;
        }
      });
    },
    cancelForm(from) {
      this.addShow = false;
      this.$refs[from].resetFields();
    },

    rowClass({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.tableIndex === rowIndex) {
        return "current-row";
      } else {
        return "";
      }
    },
    selectChange(row, index, e) {
      this.tableIndex = row.index;
      this.echartData.ptcd = row.ptcds;
      this.echartData.stime = row.stime;
      this.echartData.etime = row.etime;
      this.echartData.mtype = row.mtype;
      this.getEcharts();
    },
  },
};
</script>

<style scoped lang="scss">
.manualEntry {
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .manualEntryHistory {
    display: flex;
    // justify-content: space-between;
    width: 100%;
    height: calc(100% - 60px);
    .el-table {
      min-width: 400px;
    }
    /deep/ .el-table .current-row {
      background: #d2e8ff !important;
    }
    /deep/ .el-table .current-row td {
      background: #d2e8ff !important;
      color: #606266;
    }
    /deep/ .el-table .current-row:hover td {
      background: #d2e8ff !important;
      color: #606266;
    }
    .echart {
      width: 60%;
      height: 100%;
      margin-left: 20px;
      div {
        width: 100%;
        height: calc(100% - 50px);
      }
      .el-form {
        margin-left: 30px;
      }
      .noEcharts {
        text-align: center;
        padding-top: 200px;
        box-sizing: border-box;
        color: #999;
      }
    }
    .noData {
      width: 60%;
      height: 100%;
      text-align: center;
      padding-top: 200px;
      box-sizing: border-box;
      color: #999;
    }
  }
}
</style>