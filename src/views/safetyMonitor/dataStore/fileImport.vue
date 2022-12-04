<template>
  <div class="fileImport" v-loading="loading">
    <el-form
      label-width="80px"
      class="form-style1"
      :inline="true"
      :model="forms"
      size="small"
    >
      <el-form-item label="监测类型">
        <el-select
          v-model="forms.itemIndex"
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
        <el-select v-model="forms.name" placeholder="请选择测点编号">
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
        <el-link
          target="_blank"
          :href="baseUrl + templateUrl"
          :underline="false"
          style="margin-left: 15px"
        >
          <el-button type="success" icon="el-icon-download">下载模板</el-button>
        </el-link>
      </el-form-item>
    </el-form>

    <el-form label-width="80px" :inline="true" size="small">
      <el-form-item label="文件">
        <el-upload
          ref="upload"
          :limit="limitNum"
          :auto-upload="false"
          accept=".xlsx,.xls"
          :action="UploadUrl()"
          :before-upload="beforeUploadFile"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
        >
          <el-button size="small" type="primary" plain>导入</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item class="form-style1">
        <el-button type="primary" icon="el-icon-upload2" @click="bulkImport"
          >上传</el-button
        >
      </el-form-item>
    </el-form>

    <div class="fileImportHistory">
      <el-table
        :data="tableList"
        style="width: 40%"
        :row-class-name="rowClass"
        highlight-current-row
        @row-click="selectChange"
        height="100%"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="date"
          label="导入时间"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.importDate != ""
                  ? scope.row.importDate.split(" ")[0]
                  : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ptcds" align="center" label="测点编号">
        </el-table-column>
        <el-table-column prop="address" align="center" label="查看数据">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="viewData(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div
        class="echart"
        v-loading="echartsLoading"
        v-if="tableList.length > 0"
      >
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
      <div class="noData" v-if="tableList.length === 0">请选择上传内容</div>
    </div>
    <el-dialog
      title=""
      :visible.sync="showData"
      width="700"
      center
      :append-to-body="true"
      class="fileImportDialogBox"
    >
      <el-table :data="uploadTable" style="width: 100%" height="100%">
        <el-table-column prop="mstm" label="日期" align="center" width="180">
        </el-table-column>
        <el-table-column prop="ptcd" align="center" label="测点编号">
        </el-table-column>
        <el-table-column
          prop="r1"
          align="center"
          :label="forms.r1Name + '(' + uploadR1unit + ')'"
        >
        </el-table-column>
        <el-table-column
          prop="r2"
          v-if="forms.mtype == 1"
          align="center"
          :label="forms.r2Name + '(' + uploadR2unit + ')'"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getManualEntryType,
  uploadFile,
  getManualEntry,
  getEchartsData,
} from "@/http/api";
import axios from "axios";
import fecha from "fecha";
export default {
  data() {
    return {
      loading: false,
      forms: {
        itemIndex: null, //测点编号index
        name: "", //仪器名称
        mtype: null,
        r1Name: null,
        r2Name: null,
      },
      selectList: [],
      instrumentList: [],
      limitNum: 1, // 上传excell时，同时允许上传的最大数
      fileList: [], // excel文件列表
      templateUrl: "",
      tableData: [],
      tableList: [],
      tableLoading: false,
      tableIndex: 0,
      echartsLoading: false,
      echartsList: {},
      echartData: {
        ptcd: "",
        stime: "",
        etime: "",
        mtype: "",
      },
      baseUrl: "http://220.180.11.124:8099",
      echartForm: {
        date: [],
      },
      showData: false,
      uploadTable: [],
      uploadR1unit: "",
      uploadR2unit: "",
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
    this.getData();
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      // let test = [
      //   {
      //     mType: 8,
      //     name: "test",
      //     points: [],
      //     r1Name: "",
      //     url: "",
      //   },
      // ];
      getManualEntryType()
        .then(function (r) {
          if (r.data.code == "200") {
            that.selectList = r.data.data;
            // that.selectList = test;
            if (that.selectList.length > 0) {
              that.forms.itemIndex = 0;
              if (that.selectList[that.forms.itemIndex].points.length > 0) {
                that.instrumentList =
                  that.selectList[that.forms.itemIndex].points;
                that.forms.name =
                  that.selectList[that.forms.itemIndex].points[0].ptcd;
                that.forms.mtype = that.selectList[that.forms.itemIndex].mType;
                that.templateUrl = that.selectList[that.forms.itemIndex].url;
                that.forms.r1Name =
                  that.selectList[that.forms.itemIndex].r1Name;
                that.forms.r2Name =
                  that.selectList[that.forms.itemIndex].r2Name || "";
              }
              that.getTable();
            } else {
              that.forms.itemIndex = null;
            }
            that.loading = false;
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getTable() {
      let that = this;
      that.tableLoading = true;
      getManualEntry({
        recordType: 2,
      })
        .then(function (r) {
          if (r.data.code == "200") {
            that.tableData = r.data.data;
            if (that.tableData.length > 0) {
              that.echartData.ptcd = that.tableData[0].ptcds;
              that.echartData.stime = that.tableData[0].stime;
              that.echartData.etime = that.tableData[0].etime;
              that.echartData.mtype = that.tableData[0].mtype;
            }
            that.changeItme();
          } else {
            that.tableData = [];
          }
          that.tableLoading = false;
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getEcharts() {
      let that = this;
      that.echartsLoading = true;
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
          }
          that.echartsLoading = false;
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
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
    // 切换测点编号
    changeItme() {
      this.tableLoading = true;
      let list = [];
      if (this.forms.itemIndex !== null) {
        this.instrumentList = this.selectList[this.forms.itemIndex].points;
        if (this.selectList[this.forms.itemIndex].points.length > 0) {
          this.forms.name =
            this.selectList[this.forms.itemIndex].points[0].ptcd;
        }
        this.forms.mtype = this.selectList[this.forms.itemIndex].mType;
        this.forms.r1Name = this.selectList[this.forms.itemIndex].r1Name;
        this.forms.r2Name = this.selectList[this.forms.itemIndex].r2Name || "";
        this.templateUrl = this.selectList[this.forms.itemIndex].url;
        this.tableData.forEach((el) => {
          if (el.mtype === this.selectList[this.forms.itemIndex].mType) {
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
    getEchart() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(that.$refs.echart, "light");
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
    // 上传
    bulkImport() {
      if (this.fileList.length === 0) {
        this.$message.warning("请先导入文件");
        return;
      }
      let that = this;
      let mtype = null;
      mtype = that.selectList[that.forms.itemIndex].mType;
      let form = new FormData();
      form.append("myFile", that.fileList[0]);
      form.append("mtype", that.selectList[that.forms.itemIndex].mType);
      axios
        .post(this.baseUrl + "/rsvrApi/dsm/timeAndVal/uploadManData", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code == "200") {
            that.$message.success("上传成功");
            that.fileList = [];
            that.getTable();
          } else {
            that.$message.error("上传失败，请核对模板。");
          }
        })
        .catch((err) => {
          that.$message.error("上传失败，请核对模板。");
          // debugger
        });
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      // this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
      this.$message.warning(`最多只能上传${this.limitNum} 个文件`);
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      let index = fileList.findIndex((fileItem) => {
        return fileItem.uid === file.uid;
      });
      this.fileList.splice(index, 1);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx" || extension !== "xls") {
        this.$message.warning("只能上传后缀是.xlsx或.xls的文件");
      }
      if (size > 10) {
        this.$message.warning("文件大小不得超过10M");
      }
    },
    downloadFile() {
      this.$message.warning("暂时没有");
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    // 查看数据
    viewData(val) {
      this.showData = true;
      this.uploadTable = val.detail;
      this.uploadR1unit = val.r1unit;
      this.uploadR2unit = val.r2unit;
    },
  },
};
</script>

<style scoped lang="scss">
.fileImport {
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .fileImportHistory {
    display: flex;
    // justify-content: space-between;
    width: 100%;
    height: calc(100% - 110px);
    .el-table {
      min-width: 400px;
    }
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
  /deep/ .el-form-item__label {
    @include styles("color", "mainTextColor");
  }
}
.fileImportDialogBox /deep/ .el-dialog__body {
  height: 600px;
  .el-table {
    height: 100%;
  }
}
</style>