<template>
  <div class="limitQuery">
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
      class="form-style1 dateQuery"
      :inline="true"
      size="small"
    >
      <el-form-item label="测量项目：">
        <el-select v-model="form.project" placeholder="请选择">
          <el-option label="全部" value="全部"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设计编号：">
        <el-input v-model="form.number" placeholder="请输入设计编号"></el-input>
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
        number: '',
        project: "全部",
      },
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
  methods: {
    exportExcel() {
      exportToExcel("特征值", "out-table-ylz");
    },
  },
};
</script>

<style lang="scss" scoped>
.limitQuery {
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