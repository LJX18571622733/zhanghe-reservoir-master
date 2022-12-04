<template>
  <div class="annualStatement">
    <el-form class="form-style1" size="small" ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="活动名称">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份">
        <el-date-picker v-model="form.date" type="year" placeholder="选择年份" value-format="yyyy">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        date: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.annualStatement {
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
}
</style>