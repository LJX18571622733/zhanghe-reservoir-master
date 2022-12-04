<template>
  <div class="reportQuery" v-loading="loading">
    <div v-if="!showReport" class="reportList">
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
        <el-form-item label="建筑物">
          <el-select v-model="form.entity" placeholder="建筑物">
            <el-option label="大坝" value="大坝"></el-option>
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
          <el-table-column label="查看" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="watchReport(scope.row.id)"
                >查看</el-button
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
  </div>
</template>

<script>
import { inspectionList } from "@/http/api";
import fecha from "fecha";
import reportInfo from "./inspection/inspection.vue";
export default {
  components: { reportInfo },
  data() {
    return {
      loading: false,
      form: {
        type: "正常",
        date: [],
        entity: "大坝",
      },
      tableData: [],
      showReport: false,
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
        entity: this.form.entity,
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
    // 查看
    watchReport(id) {
      this.showReport = true;
      this.id = id;
      this.type = "watchReport";
    },
    goBack() {
      this.showReport = false;
    },
  },
};
</script>

<style scoped lang="scss">
.reportQuery {
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
    // height: calc(100% - 80px);
    // flex: 1;
    height: 100%;
  }
}
</style>