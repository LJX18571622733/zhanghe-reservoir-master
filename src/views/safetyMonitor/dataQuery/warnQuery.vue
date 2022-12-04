<template>
  <div class="warnQuery">
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
      class="form-style1 dateQuery"
      :inline="true"
      size="small"
    >
      <el-form-item label="监测项目：">
        <el-select v-model="form.project" placeholder="请选择">
          <el-option label="全部" value="全部"> </el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="exportExcel">导出</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <el-table :data="tableData" height="100%" id="out-table-ylz">
        <el-table-column type="index" width="80" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="date" label="设计编号" align="center">
        </el-table-column>
        <el-table-column prop="address" label="限制" align="center">
        </el-table-column>
        <el-table-column prop="address" label="检测值" align="center">
          <template slot-scope="scope">
            <div v-if="editId !== scope.row.id">{{ scope.row.date }}</div>
            <el-input
              v-if="editId === scope.row.id"
              v-model="monitoringValue"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="时间" align="center">
        </el-table-column>
        <el-table-column prop="address" label="备注" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="editRecord(scope.row)"
              v-if="editId !== scope.row.id"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteRecord(scope.row.id)"
              v-if="editId !== scope.row.id"
              >删除</el-button
            >

            <el-button
              type="success"
              size="small"
              @click="upadteRecord(scope.row)"
              v-if="editId === scope.row.id"
              >更新</el-button
            >
            <el-button
              size="small"
              @click="cancelRecord(scope.row.id)"
              v-if="editId === scope.row.id"
              >取消</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { exportToExcel } from "@/common/common";
export default {
  data() {
    return {
      form: {
        date: [],
        project: "全部",
      },
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: 2,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: 3,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      editId: null,
      monitoringValue: null,
    };
  },
  methods: {
    exportExcel() {
      exportToExcel("特征值", "out-table-ylz");
    },
    // 编辑
    editRecord(data) {
      this.editId = data.id;
      this.monitoringValue = data.date;
    },
    // 删除
    deleteRecord(id) {
      let that = this;
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that
          .$message({
            type: "success",
            message: "删除成功!",
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
    // 取消
    cancelRecord() {
      this.editId = null;
      this.monitoringValue = "";
    },
    // 更新
    upadteRecord(id) {
      let that = this;
      that.$message({
        type: "success",
        message: "更新成功!",
      });
      this.editId = null;
      this.monitoringValue = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.warnQuery {
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
    height: calc(100% - 110px);
    @include styles("background-color", "blockBg");
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
  }
}
</style>