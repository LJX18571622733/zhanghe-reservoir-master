<template>
  <!-- 逐日水位年报表 -->
  <div class="rainfallReport">
    <el-form
      :inline="true"
      size="small"
      :model="form"
      class="demo-form-inline form-style1"
    >
      <el-form-item label="年度：">
        <el-date-picker
          v-model="form.year"
          value-format="yyyy"
          type="year"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableData"
          >查询</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          size="small"
          @click="exportExcel"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <!-- <div class="reportTitle">{{ form.year }}年度逐日上游水位统计表</div> -->
    <div class="reportTitle">{{ form.year }}年度逐日坝上水位报表</div>
    <el-table
      class="bigTable"
      :data="tableData"
      style="width: 100%"
      height="100%"
      v-loading="loading"
      id="out-table-ylz"
      :span-method="arraySpanMethod"
    >
      <el-table-column prop="tm" label="日期" align="center">
        <el-table-column prop="tm" align="center">
          <template slot-scope="scope">
            <div>
              {{
                isNumber(scope.row.tm) === true || scope.row.tm == "全年统计"
                  ? scope.row.tm
                  : "全月统计"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tm" align="center"> </el-table-column>
      </el-table-column>
      <!-- <el-table-column label="月份及上游水位(m)" align="center"> -->
      <el-table-column label="月份及坝上水位(m)" align="center">
        <template v-for="(item, key, index) in tableData[0]">
          <el-table-column
            :key="index"
            :label="changeType(key)"
            align="center"
            v-if="isNumber(changeType(key))"
          >
            <template slot-scope="scope">
              <div>
                {{
                  scope.row[key] === null || scope.row[key] === ""
                    ? "-"
                    : scope.row[key]
                }}
              </div>
            </template>
          </el-table-column>
        </template></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
import { getWaterLevelReport } from "@/http/api";
import { exportToExcel } from "@/common/common";
export default {
  data() {
    return {
      loading: false,
      form: {
        year: "",
      },
      rainfall: null, //河道
      tableData: [],
    };
  },
  created() {
    this.form.year = String(new Date().getFullYear());
    this.getTableData();
  },
  methods: {
    getTableData() {
      let that = this;
      that.loading = true;
      getWaterLevelReport(that.form.year, {})
        .then(function (r) {
          let data = [];
          if (r.data.code == 200) {
            data = r.data.data;
            data.yearStatements.forEach((el) => {
              if (that.isNumber(el.tm) === true) {
                el.tm = Number(el.tm);
              }
            });
            data.yearStatements.sort((a, b) => {
              return a.tm - b.tm;
            });
            data.yearStatements.push({
              january: "最高",
              february: data.yearMax,
              march: "日期",
              april: data.maxTm,
              may: "最低",
              june: data.yearMin,
              july: "日期",
              august: data.minTm,
              tm: "全年统计",
            });
            that.loading = false;
            that.tableData = data.yearStatements;
            var x =
              document.getElementsByClassName("el-table__header")[0].rows[0]
                .cells;
            // // 将第一列表头单元格的rowSpan设为2
            x[0].rowSpan = 2;
            var x2 =
              document.getElementsByClassName("el-table__header")[0].rows[1]
                .cells;
            that.$nextTick(() => {
              x2.forEach((el, index) => {
                if (index < 12) {
                  x2[index].innerText = index + 1;
                } else {
                  x2[14].innerText = "";
                  x2[13].innerText = "";
                  x2[12].innerText = "";
                }
              });
            });
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg =
        /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    sortNumber(a, b) {
      return a - b;
    },
    changeType(val) {
      let data = {
        january: "1",
        february: "2",
        march: "3",
        april: "4",
        may: "5",
        june: "6",
        july: "7",
        august: "8",
        september: "9",
        october: "10",
        november: "11",
        december: "12",
        tm: "日期",
      };
      return data[val];
    },
    exportExcel() {
      exportToExcel(this.form.year + "年度逐日上游水位报表", "out-table-ylz");
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.isNumber(row.tm) === true || row.tm === "全年统计") {
        if (columnIndex === 0) {
          if (row.tm === "全年统计") {
            return [1, 2];
          } else {
            return [1, 2];
          }
        } else if (columnIndex === 1) {
          return [0, 0];
        } else {
          if (row.tm === "全年统计") {
            if (
              columnIndex === 5 ||
              columnIndex === 6 ||
              columnIndex === 7 ||
              columnIndex === 8
            ) {
              return [1, 2];
            }
          }
        }
      } else {
        if (columnIndex === 0) {
          if (rowIndex === this.tableData.length - 5) {
            return [4, 1];
          } else {
            return [0, 0];
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rainfallReport {
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  @include styles("background-color", "blockBg");
  .reportTitle {
    font-size: 17px;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 600;
    @include styles("color", "listTitle");
  }
}
</style>