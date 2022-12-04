<template>
  <div class="repQuery">
    <div class="leftContent">
      <el-form :model="form" class="form-style1 mt-10 timeQuery">
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报告类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="正常" value="正常"> </el-option>
            <el-option label="异常" value="异常"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检类型">
          <el-select v-model="form.recordType" placeholder="请选择">
            <el-option label="主坝日常巡检" value="主坝日常巡检"> </el-option>
            <el-option label="年度巡视检查" value="年度巡视检查"> </el-option>
            <el-option label="特别安全检查" value="特别安全检查"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="formButton">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>

      <div style="height: calc(100% - 300px)" v-loading="listLoading">
        <ul class="queryData" v-if="reportList.length > 0">
          <li
            v-for="(item, index) in reportList"
            :key="index"
            :class="currentIndex == index ? 'active' : ''"
            @click="changeReport(index, item.id)"
          >
            <p>巡检对象：{{ item.entity }}</p>
            <p>巡检时间：{{ item.time }}</p>
            <p>巡检类型：{{ item.type }}</p>
            <p>巡检人：{{ item.principal }}</p>
          </li>
        </ul>
        <div class="noData" v-if="reportList.length == 0">暂无数据</div>
      </div>
    </div>

    <div ref="print" id="print" v-loading="loading">
      <div
        class="title"
        style="
          text-align: center;
          font-size: 20px;
          flex-wrap: 600;
          text-align: center;
          margin: 15px 0 10px;
          font-weight: 600;
        "
      >
        梅山水库日常巡视检查记录表
      </div>

      <el-table
        :data="reportProject"
        style="width: 100%"
        :span-method="arraySpanMethod"
        id="out-table-ylz"
      >
        <el-table-column prop="date" label="检查项目及部位" align="center">
          <el-table-column align="center" width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.msps }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="dvcd" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.msps === 'staff'">
                <div>{{ scope.row.dvcd }}</div>
                <div style="margin-top: 10px">{{ scope.row.signature }}</div>
              </div>
              <div v-else>{{ scope.row.dvcd }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="检查结果" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.result == 1
                  ? scope.row.remark == ""
                    ? "正常"
                    : "正常（" + scope.row.remark + "）"
                  : scope.row.remark
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="初步处理意见" align="center"> </el-table-column>
      </el-table>

      <div class="imgBox">
        <div class="location">定位：{{ reportData.dsmPtrRecord.address }}</div>
        <el-image
          v-for="(item, index) in reportData.dsmPtrMpImgs"
          :key="index"
          :src="baseUrl + item.imgUrl"
          :preview-src-list="srcList"
        >
        </el-image>
      </div>
    </div>
    <div class="formButton printBtn">
      <el-button type="primary" @click="printContext">打印</el-button>
      <el-button type="primary" icon="el-icon-download" @click="exportExcel"
        >导出</el-button
      >
    </div>
  </div>
</template>

<script>
import { getPatrolReportList, getPatrolReport } from "@/http/api";
import { exportToExcel } from "@/common/common";
import fecha from "fecha";
export default {
  data() {
    return {
      form: {
        date: [],
        type: "正常",
        recordType: "主坝日常巡检",
      },
      listLoading: false,
      loading: false,
      reportData: {
        dsmPtrRecord: {},
      },
      borderColor: "#bbb",
      currentIndex: 0,
      reportList: [],
      itemNumber: {}, //左边检查项目得个数
      reportId: null,
      reportProject: [],
      srcList: [], //图片预览
      baseUrl: "http://220.180.11.124:8099",
    };
  },
  watch: {
    sysTheme() {
      if (this.sysTheme == "light") {
        this.borderColor = "#bbb";
      } else if (this.sysTheme == "dark") {
        this.borderColor = "#00f8fe";
      }
    },
  },
  created() {
    this.getDate();
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
    // this.getReportDetail();
    this.getData();
    if (this.sysTheme == "light") {
      this.borderColor = "#bbb";
    } else if (this.sysTheme == "dark") {
      this.borderColor = "#00f8fe";
    }
  },
  methods: {
    getDate() {
      // var nowDate = new Data()
      let current = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); //7天前
      this.form.date[0] = fecha.format(start, "YYYY-MM-DD");
      this.form.date[1] = fecha.format(current, "YYYY-MM-DD");
    },
    getData() {
      this.listLoading = true;
      let that = this;
      let params = {
        endTime: this.form.date[1] + " 23:59:59",
        entity: "大坝",
        startTime: this.form.date[0] + " 00:00:00",
        type: this.form.type,
        recordType: this.form.recordType,
      };
      getPatrolReportList(params)
        .then(function (r) {
          if (r.data.code == 200) {
            that.reportList = r.data.data.dsmPtrRecords;
            that.listLoading = false;
            var x =
              document.getElementsByClassName("el-table__header")[0].rows[0]
                .cells;

            // // 将第一列表头单元格的colSpan设为2
            x[0].rowSpan = 2;
            if (that.reportList.length > 0) {
              that.reportId = that.reportList[0].id;
              that.getReportDetail();
            }
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },

    // 打印
    printContext() {
      this.$print(this.$refs.print);
    },
    getReportDetail() {
      let that = this;
      this.loading = true;
      getPatrolReport(that.reportId)
        .then(function (r) {
          if (r.data.code == 200) {
            that.reportData = r.data.data;

            if (that.reportData.dsmPtrMpImgs.length > 0) {
              that.reportData.dsmPtrMpImgs.forEach((el) => {
                that.srcList.push(that.baseUrl + el.imgUrl);
              });
            }
            let resData = [];
            let reportProject = [];

            resData = r.data.data.mpExtends;
            reportProject = [
              {
                dvcd: "检查日期",
                msps: "检查日期",
                remark: r.data.data.dsmPtrRecord.time,
              },
              {
                dvcd: "检查时库水位及天气",
                msps: "检查时库水位及天气",
                remark: r.data.data.dsmPtrRecord.weather,
              },
              {
                dvcd: "水库异常渗漏、滑坡",
                msps: "水库异常渗漏、滑坡",
                remark: r.data.data.dsmPtrRecord.type,
              },
            ];

            that.reportProject = reportProject.concat(resData);
            that.itemNumber = [];
            that.reportProject.forEach((el, i) => {
              if (that.itemNumber[el.msps] == undefined) {
                // that.itemNumber[el.msps] = 1;
                that.itemNumber[el.msps] = {
                  number: 1,
                  location: i,
                };
              } else {
                that.itemNumber[el.msps].number++;
              }
            });
            let staff = [];
            staff = [
              {
                msps: "staff",
                dvcd: "检查人员：" + that.reportData.dsmPtrRecord.principal,
                signature: "检查人员（签字）：",
              },
              {
                msps: "staff",
                dvcd: "记录人员：" + that.reportData.dsmPtrRecord.recordPerson,
                signature: "记录人员（签字）：",
              },
              {
                msps: "staff",
                signature: "审核人员（签字）：",
                dvcd: "审核人员（签字）",
              },
            ];
            that.reportProject = that.reportProject.concat(staff);

            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    changeReport(val, id) {
      this.currentIndex = val;
      this.reportId = id;
      this.getReportDetail();
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row.msps, column, rowIndex, columnIndex);
      if (columnIndex === 0 && rowIndex < 3) {
        // 前三排合并
        return [1, 2];
      } else if (columnIndex === 1 && rowIndex < 3) {
        // 前三排第二格不显示
        return [2, 0];
      } else if (columnIndex === 0 && rowIndex > 2 && row.msps != "staff") {
        // 后排重复
        if (this.itemNumber[row.msps]) {
          // 左边合并
          if (rowIndex == this.itemNumber[row.msps].location) {
            return [this.itemNumber[row.msps].number, 1];
          } else {
            // 左边合并多余的不显示
            return [this.itemNumber[row.msps].number, 0];
          }
        }
      } else if (row.msps == "staff") {
        if (columnIndex === 0) {
          return [1, 0];
        } else if (columnIndex === 1) {
          return [1, 4];
        }
      }
    },
    exportExcel() {
      exportToExcel("梅山水库日常巡视检查记录表", "out-table-ylz");
    },
  },
};
</script>

<style lang="scss" scoped>
.repQuery {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  .leftContent {
    width: 400px;
    .noData {
      margin: 100px auto 0;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  }
  .printBtn {
    position: absolute;
    right: 40px;
    top: 20px;
  }
  .queryData {
    margin-right: 20px;
    font-size: 14px;
    height: 100%;
    overflow: auto;
    @include styles("color", "titleTextColor");
    li {
      position: relative;
      width: 280px;
      min-width: 280px;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      @include styles("border-color", "treeBorder");
      padding: 15px 20px;
      cursor: pointer;
      p {
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    li:nth-child(n + 2) {
      border-top: none;
    }
    li.active::after {
      top: -1px;
      left: -1px;
      position: absolute;
      content: "";
      border-color: #3392ff;
      border-width: 2px;
      height: calc(100% + 1px);
      border-style: solid;
      width: 280px;
      z-index: 10;
      box-sizing: border-box;
    }
  }

  #print {
    width: 800px;
    min-width: 600px;
    margin: 0 auto;
    height: calc(100% - 10px);
    overflow: auto;
    @include styles("color", "titleTextColor");
    .title {
      @include styles("color", "titleTextColor");
    }
    /deep/ .el-table__body .el-table__row:nth-last-child(3) td {
      text-align: left;
    }
    /deep/ .el-table__body .el-table__row:nth-last-child(2) td {
      text-align: left;
    }
    /deep/ .el-table__body .el-table__row:nth-last-child(1) td {
      text-align: left;
    }
  }
  .imgBox {
    .location {
      margin-bottom: 20px;
    }
    width: 100%;
    margin-top: 20px;
    .el-image {
      width: 22%;
      height: 120px;
      margin-right: 4%;
      margin-bottom: 20px;
    }
    .el-image:nth-child(n + 5) {
      margin-right: 0;
    }
    /deep/ .el-icon-circle-close {
      color: #fff;
    }
    /deep/ .el-image-viewer__img {
      height: 80%;
    }
    /deep/ .el-image-viewer__close {
      top: 80px;
    }
  }
  @media print {
    text-align: center;
    width: 100%;
    margin: auto;
    page-break-after: always;
    margin-top: 20px;
    font-family: "微软雅黑";
  }
}
</style>
<style medis="print">
@page {
  size: auto A4 landscape;
  margin: 5mm 8mm;
}
</style>