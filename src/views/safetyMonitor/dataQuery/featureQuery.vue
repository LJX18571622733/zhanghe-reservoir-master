<template>
  <div class="featureQuery">
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
      class="form-style1 dateQuery"
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
      <el-form-item label="统计时段：">
        <el-radio-group v-model="form.timeFrame">
          <el-radio label="按年统计">按年统计</el-radio>
          <el-radio label="按季统计">按季统计</el-radio>
          <el-radio label="按月统计">按月统计</el-radio>
          <el-radio label="按时段统计">按时段统计</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="统计内容：">
        <el-checkbox-group v-model="form.content">
          <el-checkbox label="最大值">最大值</el-checkbox>
          <el-checkbox label="最小值">最小值</el-checkbox>
          <el-checkbox label="平均值">平均值</el-checkbox>
          <el-checkbox label="最大幅度">最大幅度</el-checkbox>
          <el-checkbox label="合计">合计</el-checkbox>
        </el-checkbox-group>
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
        <el-table-column prop="name" label="统计时间" align="center">
        </el-table-column>
        <el-table-column prop="address" label="检测量" align="center">
        </el-table-column>
        <el-table-column prop="address" label="统计量" align="center">
        </el-table-column>
        <el-table-column prop="address" label="特征值" align="center">
        </el-table-column>
        <el-table-column prop="address" label="时间" align="center">
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
        timeFrame: "按年统计",
        content: ["最大值"],
      },
      tableData: [
        {
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
.featureQuery {
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
    height: calc(100% - 260px);
    @include styles("background-color", "blockBg");
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
  }
}
</style>