<template>
  <el-row>
    <el-col :span="24" class="tableFormR">
      <el-table
        border
        :data="data"
        :height="height"
        :id="id"
        style="width: 100%; background: rgba(40, 73, 133, 0.8)"
      >
        <el-table-column prop="tm" sortable align="center" label="时间">
        </el-table-column>
        <el-table-column prop="val" align="center" :label="textName">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "tableChart",
  props: ["data", "textName", "height", "id"],
};
</script>

<style scoped>
.tableFormR /deep/ .el-table__body-wrapper {
  overflow-y: auto;
  height: calc(100% - 44px) !important;
}
</style>
