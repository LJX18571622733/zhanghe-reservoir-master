<template>
  <div class="formula">
    <el-page-header @back="goBack" content="公式"> </el-page-header>
    <el-button
      class="add"
      size="medium"
      type="primary"
      @click="editMeasuredValue('new')"
      >新增</el-button
    >

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="90px" align="center">
      </el-table-column>
      <el-table-column prop="date" label="公式名称" align="center">
      </el-table-column>
      <el-table-column prop="name" label="计算结果存放字段" align="center">
      </el-table-column>
      <el-table-column prop="address" label="计算结果存放中文" align="center">
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editMeasuredValue('edit', scope.row)"
            >编辑</el-button
          >
          <el-button class="delete" type="text" @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.id === null ? '新增' : '编辑'"
      :append-to-body="true"
      :visible.sync="editVisible"
      width="500px"
      center
    >
      <el-form label-width="110px" :model="form" ref="form">
        <el-form-item label="公式名称" prop="name">
          <el-select v-model="form.name" placeholder="请选择水库名称">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结果字段名" prop="name">
          <el-select v-model="form.name" placeholder="请选择水库名称">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结果字段名中文" prop="account">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { measuredValueDetail } from "@/http/api";
export default {
  props: ["type", "id"],
  data() {
    return {
      form: {},
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      editVisible: false,
    };
  },
  mounted() {
    if (this.type == "" && this.id == null) {
      this.$router.push("entering");
    } else {
      this.getData();
    }
  },
  methods: {
    getData() {
      let that = this;
      //   that.loading = true;
    },
    // 新增测值
    editMeasuredValue() {},
    goBack() {
      this.$emit("goBack");
    },
    // 编辑
    editMeasuredValue() {
      this.editVisible = true;
    },
    // 删除
    deleteBtn() {},
    cancelForm() {
      this.editVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.formula {
  @include styles("color", "titleTextColor");
  font-size: 17px;
  .add {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 20px;
  }
  .delete {
    color: red;
  }
}
</style>