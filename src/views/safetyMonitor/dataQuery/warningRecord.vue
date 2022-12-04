<template>
  <div class="warningRecord">
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
      class="form-style1 dateQuery"
      :inline="true"
      size="small"
    >
      <el-form-item label="起止时间：">
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
      <el-form-item label="预警状态：">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="全部" value="all"> </el-option>
          <el-option label="正在预警" value="warning"> </el-option>
          <el-option label="已确认" value="sure"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监测部位：">
        <el-select v-model="form.site" placeholder="请选择" @change="getSite">
          <el-option
            v-for="(item, index) in monitoringSite"
            :key="index"
            :label="item.sortName"
            :value="item.ptcnId + ';' + item.sortName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测点编号：">
        <el-select v-model="form.number" placeholder="请选择">
          <el-option
            v-for="(item, index) in numberList"
            :key="index"
            :label="item.ptcd"
            :value="item.ptcd"
            v-loading="numberLoading"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="getData">查询</el-button> -->
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="success" icon="el-icon-download" @click="exportExcel"
          >导出</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button class="batchDelete" size="small" @click="batchDeleteRecord"
          >批量确认预警</el-button
        >
      </el-form-item>
    </el-form>

    <div class="table">
      <el-table
        :data="tableDatas"
        v-loading="loading"
        height="calc(100% - 30px)"
        id="out-table-ylz"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="selectEnable" type="selection" width="70">
        </el-table-column>
        <el-table-column prop="prnm" label="监测部位" align="center">
        </el-table-column>
        <el-table-column prop="mtnm" label="监测项目" align="center">
        </el-table-column>
        <el-table-column prop="ptcd" label="测点编号" align="center">
        </el-table-column>
        <el-table-column prop="valName" label="测量物理量" align="center">
        </el-table-column>
        <el-table-column prop="pbtm" label="触发报警时间" align="center">
        </el-table-column>
        <el-table-column prop="wrvl" label="报警测值" align="center">
        </el-table-column>
        <el-table-column prop="wrst" label="预警状态" align="center">
          <template slot-scope="scope">
            <div :style="scope.row.wrst == 0 ? 'color: rgb(230, 162, 60)' : ''">
              {{
                scope.row.wrst == 1
                  ? "已确认"
                  : scope.row.wrst == 0
                  ? "正在预警"
                  : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cancelTime" label="解除时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="deleteRecord(scope.row.wreccd)"
              v-if="scope.row.wrst == 0"
              >确认预警</el-button
            >
            <!-- <el-button
              type="text"
              size="small"
              class="delete"
              @click="deleteRecord(scope.row.id)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { exportToExcel } from "@/common/common";
import {
  getWarning,
  affirmWarning,
  getPointListClassTree,
  getPointListData,
} from "@/http/api";
import fecha from "fecha";
import { log } from "three";
export default {
  props: ["updateWarning"],
  data() {
    return {
      form: {
        date: [],
        type: "all",
        site: "all;全部",
        number: "全部",
      },
      // tableData: [
      //   { prnm: "1#垛", ptcd: "UP01", wrst: "0" },
      //   { prnm: "3#垛", ptcd: "J03-05", wrst: "1" },
      //   { prnm: "3#垛", ptcd: "J03-01", wrst: "0" }],
      tableData: [],
      tableDatas: [],
      loading: false,
      selectList: [], //选择的测点
      monitoringSite: [], //监测部位
      numberList: [], //测点编号
    };
  },
  computed: {
    ...mapGetters({
      sysWarningInfo: "menu/warningInfo",
    }),
  },
  watch: {
    sysWarningInfo() {
      if (this.sysWarningInfo === "update") {
        this.getData();
      }
    },
  },
  mounted() {
    let current = new Date();
    let start = new Date();
    start.setTime(new Date(start.getFullYear() - 1, 6, 1));
    current.setTime(current.getTime());
    this.form.date = [
      fecha.format(start, "YYYY-MM-DD"),
      fecha.format(current, "YYYY-MM-DD"),
    ];
    this.getSelect();
    this.getData();
    // this.getTable();
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      getWarning(
        `${"stime=" + this.form.date[0] + "&" + "etime=" + this.form.date[1]}`
      )
        .then((r) => {
          if (r.data.code == "200") {
            that.tableData = r.data.data;
            that.getTable();
            // that.loading = false;
            that.$store.state.menu.warningInfo = "";
          } else {
            that.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    getSelect() {
      let that = this;
      let list = [];
      that.monitoringSite = [];
      getPointListClassTree()
        .then((r) => {
          if (r.data.code == "200") {
            list = r.data.data;
            list.forEach((el) => {
              if (el.sortName === "按监测部位") {
                that.monitoringSite = el.childList;
              }
            });
            that.monitoringSite.unshift({
              sortName: "全部",
              ptcnId: "all",
            });
          } else {
            that.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    getSite() {
      let that = this;
      this.numberLoading = true;
      getPointListData({
        ptcnId: this.form.site.split(";")[0],
      })
        .then((r) => {
          if (r.data.code == "200") {
            that.numberList = r.data.data;
            that.numberList.unshift({
              ptcd: "全部",
            });
            that.form.number = "全部";
            that.numberLoading = false;
          } else {
            that.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    exportExcel() {
      exportToExcel("预警预报记录", "out-table-ylz");
    },
    // 删除
    deleteRecord(id) {
      let that = this;
      this.$confirm("此操作将不再提示该条预警信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          affirmWarning({
            wreccdList: [id],
          })
            .then((r) => {
              if (r.data.code == "200") {
                that.$message({
                  type: "success",
                  message: "解除成功!",
                });
                that.getData();
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
            message: "已取消解除",
          });
        });
    },
    batchDeleteRecord() {
      let that = this;
      let list = [];

      if (this.selectList.length === 0) {
        this.$message.info("请选择要解除的预警");
        return;
      }
      this.selectList.forEach((el) => {
        list.push(el.wreccd);
      });
      this.$confirm("此操作将不再提示所选中的预警信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          affirmWarning({
            wreccdList: list,
          })
            .then((r) => {
              if (r.data.code == "200") {
                that.$message({
                  type: "success",
                  message: "解除成功!",
                });
                that.getData();
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
            message: "已取消解除",
          });
        });
    },
    selectEnable(row, rowIndex) {
      if (row.wrst == 1) {
        // 禁用
        return false;
      } else {
        return true;
      }
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    getTable() {
      let wrst = 0;
      if (this.form.type !== "all") {
        wrst = this.form.type == "warning" ? "0" : "1";
      }
      this.tableDatas = [];
      if (
        this.form.type === "all" &&
        this.form.site === "all;全部" &&
        this.form.number === "全部"
      ) {
        this.tableDatas = this.tableData;
      } else if (
        this.form.type === "all" &&
        this.form.site !== "all;全部" &&
        this.form.number === "全部"
      ) {
        this.tableData.forEach((el) => {
          if (el.prnm === this.form.site.split(";")[1]) {
            this.tableDatas.push(el);
          }
        });
      } else if (
        this.form.type === "all" &&
        this.form.site !== "all;全部" &&
        this.form.number !== "全部"
      ) {
        this.tableData.forEach((el) => {
          if (
            el.prnm === this.form.site.split(";")[1] &&
            el.ptcd === this.form.number
          ) {
            this.tableDatas.push(el);
          }
        });
      } else if (this.form.type !== "all" && this.form.site === "all;全部") {
        this.tableData.forEach((el) => {
          if (el.wrst == wrst) {
            this.tableDatas.push(el);
          }
        });
      } else if (
        this.form.type !== "all" &&
        this.form.site !== "all;全部" &&
        this.form.number === "全部"
      ) {
        this.tableData.forEach((el) => {
          if (el.wrst == wrst && el.prnm === this.form.site.split(";")[1]) {
            this.tableDatas.push(el);
          }
        });
      } else if (
        this.form.type !== "all" &&
        this.form.site !== "all;全部" &&
        this.form.number !== "all"
      ) {
        this.tableData.forEach((el) => {
          if (
            el.wrst == wrst &&
            el.prnm === this.form.site.split(";")[1] &&
            el.ptcd === this.form.number
          ) {
            this.tableDatas.push(el);
          }
        });
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.warningRecord {
  overflow: auto;
  // @include styles("background-color", "blockBg");
  // padding: 20px;
  .dateQuery {
    @include styles("background-color", "blockBg");
    padding: 18px 20px 1px;
    .switchData {
      float: right;
    }
  }
  .table {
    height: calc(100% - 120px);
    @include styles("background-color", "blockBg");
    padding: 0 20px;
    box-sizing: border-box;
  }
  .delete {
    color: red;
  }
  // .batchDelete {
  //   position: absolute;
  //   right: 35px;
  //   top: 20px;
  // }
}
</style>