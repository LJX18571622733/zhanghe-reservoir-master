<template>
  <div class="report" v-loading="loading">
    <div v-if="!showReport && !showEdit" class="reportList">
      <el-form
        :inline="true"
        :model="form"
        class="form-style1"
        label-width="100px"
        size="small"
      >
        <el-form-item label="报告类型">
          <el-select v-model="form.type" placeholder="报告类型">
            <el-option label="正常" value="正常"></el-option>
            <el-option label="存在异常" value="存在异常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData"
            >查询</el-button
          >
        </el-form-item>
      </el-form>

      <div class="table">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="entity" label="坝名" align="center">
          </el-table-column>
          <el-table-column prop="recordType" label="检查类型" align="center">
          </el-table-column>
          <el-table-column prop="time" label="检查日期" align="center">
          </el-table-column>
          <el-table-column prop="principal" label="检查人员" align="center">
          </el-table-column>
          <!-- <el-table-column label="上报" align="center">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                icon="el-icon-upload2"
                @click="Reported(scope.row.id)"
                >上报</el-button
              >
            </template>
          </el-table-column> -->
          <el-table-column label="编辑" align="center" class-name="form-style1">
            <template slot-scope="scope">
              <el-button type="text" @click="editReport(scope.row.id)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="查看" align="center" class-name="form-style1">
            <template slot-scope="scope">
              <el-button type="text" @click="watchReport(scope.row.id)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="删除" align="center" class-name="form-style1">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="delete"
                @click="deleteReport(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <report-info
      v-if="showReport"
      :id="id"
      :type="type"
      @goBack="goBack"
    ></report-info>
    <edit v-if="showEdit" @goEditBack="goEditBack" :id="id"></edit>
  </div>
</template>

<script>
import { inspectionList, inspectionDelete } from "@/http/api";
import fecha from "fecha";
import reportInfo from "./inspection/inspection.vue";
import edit from "./inspection/edit.vue";
export default {
  components: { reportInfo, edit },
  data() {
    return {
      loading: false,
      form: {
        type: "正常",
        date: [],
      },
      tableData: [],
      showReport: false,
      showEdit: false,
      id: null,
      type: "",
    };
  },
  mounted() {
    let current = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.form.date = [
      fecha.format(start, "YYYY-MM-DD"),
      fecha.format(current, "YYYY-MM-DD"),
    ];
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      if (this.form.date === null || this.form.date.length == 0) {
        this.$message.info("请选择检查时间");
        return;
      }
      inspectionList({
        endTime: this.form.date[1] + " 23:59:59",
        entity: "大坝",
        startTime: this.form.date[0] + " 00:00:00",
        type: this.form.type,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.tableData = r.data.data.dsmPtrRecords;
            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          // console.log(err.response.data.message);
          that.$message.error("请联系管理人员");
        });
    },
    // 上报
    Reported(id) {
      this.showReport = true;
      this.id = id;
      this.type = "Reported";
    },
    // 查看
    watchReport(id) {
      this.showReport = true;
      this.id = id;
      this.type = "watch";
    },
    editReport(id) {
      this.showEdit = true;
      this.id = id;
    },
    // 删除
    deleteReport(id) {
      let that = this;
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          inspectionDelete(id)
            .then(function (r) {
              if (r.data.code == 200) {
                that.$message({
                  type: "success",
                  message: "删除成功!",
                });
                that.getData();
              } else {
                that.$message.error(r.data.msg);
              }
            })
            .catch((err) => {
              that.$message.error("操作失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goBack() {
      this.showReport = false;
    },
    goEditBack() {
      this.showEdit = false;
    },
  },
};
</script>

<style scoped lang="scss">
.report {
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .reportList {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .table {
    height: 100%;
  }
  .delete {
    color: red;
  }
}
</style>